import os
import re
import json
import asyncio
from datetime import datetime, timedelta
from typing import Dict

import requests
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from playwright.async_api import async_playwright
from playwright.sync_api import sync_playwright
from dotenv import load_dotenv
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
import threading
from concurrent.futures import ThreadPoolExecutor

# --- FastAPI App Initialization ---
app = FastAPI()

# Allow requests from your frontend (running on http://localhost:3000)
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- AI Configuration ---
# Make sure to set your API_KEY as an environment variable
# Load variables from .env so deployments don't need to export manually
load_dotenv()

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY environment variable not set.")

genai.configure(api_key=api_key)

# Try multiple model names in order of preference (based on testing)
model_names = ['models/gemini-2.5-flash', 'gemini-2.5-flash', 'models/gemini-2.0-flash', 'gemini-2.0-flash']
model = None

for model_name in model_names:
    try:
        model = genai.GenerativeModel(model_name)
        print(f"✅ Using model: {model_name}")
        break
    except Exception as e:
        print(f"❌ Failed to load model {model_name}: {e}")
        continue

if model is None:
    raise ValueError("Could not initialize any Gemini model. Please check your API key and model availability.")

# --- Web Scraping Logic ---
def _extract_videos_from_initial_data(initial_data: dict, limit: int = 5) -> list[dict]:
    """Recursively find videoRenderer objects in YouTube initial data."""
    videos: list[dict] = []

    def walk(node):
        if isinstance(node, dict):
            if "videoRenderer" in node:
                vr = node["videoRenderer"]
                title_runs = vr.get("title", {}).get("runs", [{}])
                title = title_runs[0].get("text", "No Title")
                video_id = vr.get("videoId", "")
                url = f"https://www.youtube.com/watch?v={video_id}" if video_id else "#"

                owner_runs = (
                    vr.get("ownerText", {}).get("runs")
                    or vr.get("longBylineText", {}).get("runs")
                    or [{}]
                )
                channel_name = owner_runs[0].get("text", "No Channel Name")

                views_runs = vr.get("viewCountText", {}).get("runs") or [{}]
                views = views_runs[0].get("text", "No Views")

                publish_runs = vr.get("publishedTimeText", {}).get("runs") or [{}]
                publish_date = publish_runs[0].get("text", "No Date")

                videos.append(
                    {
                        "title": title,
                        "url": url,
                        "channelName": channel_name,
                        "views": views,
                        "publishDate": publish_date,
                    }
                )

                return  # Do not recurse inside a videoRenderer to avoid duplicates

            for value in node.values():
                walk(value)
        elif isinstance(node, list):
            for item in node:
                walk(item)

    walk(initial_data)
    return videos[:limit]


def scrape_youtube_videos_http(keyword: str) -> list[dict]:
    """Fallback scraper using HTTP (no browser)."""
    search_query = keyword.replace(" ", "+")
    url = f"https://www.youtube.com/results?search_query={search_query}&hl=en"

    headers = {
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        ),
    }

    resp = requests.get(url, headers=headers, timeout=15)
    if not resp.ok:
        raise RuntimeError(f"HTTP fetch failed with status {resp.status_code}")

    match = re.search(r"ytInitialData\"?\s*=\s*(\{.*?\})\s*;", resp.text, re.DOTALL)
    if not match:
        raise RuntimeError("ytInitialData not found in response")

    initial_data = json.loads(match.group(1))
    videos = _extract_videos_from_initial_data(initial_data)
    if not videos:
        raise RuntimeError("No videos parsed from ytInitialData")
    return videos


async def scrape_youtube_videos(keyword: str):
    try:
        async with async_playwright() as p:
            # Try different browser configurations
            browser_configs = [
                # Config 1: Firefox (more stable on Windows)
                lambda: p.firefox.launch(headless=True),
                # Config 2: Chromium with minimal args
                lambda: p.chromium.launch(
                    headless=True,
                    args=['--no-sandbox']
                ),
                # Config 3: System Chrome
                lambda: p.chromium.launch(
                    headless=True,
                    channel='chrome'
                )
            ]

            last_error = None
            for launch_browser in browser_configs:
                try:
                    browser = await launch_browser()
                    page = await browser.new_page()
                    
                    search_query = keyword.replace(' ', '+')
                    await page.goto(f"https://www.youtube.com/results?search_query={search_query}")
                    
                    # Wait for videos to load
                    await page.wait_for_selector('ytd-video-renderer', timeout=10000)
                    
                    video_elements = await page.query_selector_all('ytd-video-renderer')
                    
                    videos = []
                    for i, video_element in enumerate(video_elements[:5]):
                        try:
                            title_element = await video_element.query_selector('#video-title')
                            title = await title_element.get_attribute('title') if title_element else "No Title"
                            url_suffix = await title_element.get_attribute('href') if title_element else ""
                            url = f"https://www.youtube.com{url_suffix}" if url_suffix else "No URL"
                            
                            channel_name_element = await video_element.query_selector('#channel-name .yt-simple-endpoint')
                            channel_name = await channel_name_element.inner_text() if channel_name_element else "No Channel Name"
                            
                            metadata_line = await video_element.query_selector('#metadata-line')
                            views = "No Views"
                            publish_date = "No Date"
                            if metadata_line:
                                spans = await metadata_line.query_selector_all('span')
                                if len(spans) >= 2:
                                    views = await spans[0].inner_text()
                                    publish_date = await spans[1].inner_text()

                            videos.append({
                                "title": title,
                                "url": url,
                                "channelName": channel_name,
                                "views": views,
                                "publishDate": publish_date,
                            })
                        except Exception as e:
                            print(f"Error processing video element: {e}")
                            continue
                    
                    await browser.close()
                    return videos
                    
                except Exception as e:
                    last_error = e
                    print(f"Browser configuration failed: {e}")
                    continue

            print(f"All browser configurations failed. Last error: {last_error}")
            try:
                return scrape_youtube_videos_http(keyword)
            except Exception as http_error:
                print(f"HTTP fallback scraping failed: {http_error}")
                return [{
                    "title": "Could not fetch videos",
                    "url": "#",
                    "channelName": "Error",
                    "views": "N/A",
                    "publishDate": "N/A"
                }]
                
    except Exception as e:
        print(f"Browser launch error: {e}")
        try:
            return scrape_youtube_videos_http(keyword)
        except Exception as http_error:
            print(f"HTTP fallback scraping failed: {http_error}")
            try:
                return scrape_youtube_videos_http(keyword)
            except Exception as http_error:
                print(f"HTTP fallback scraping failed: {http_error}")
                return [{
                    "title": "Could not fetch videos",
                    "url": "#",
                    "channelName": "Error",
                    "views": "N/A",
                    "publishDate": "N/A"
                }]

def scrape_youtube_videos_sync(keyword: str):
    try:
        with sync_playwright() as p:
            # Try different browser types in order
            browser_types = [p.firefox, p.chromium, p.webkit]
            
            for browser_type in browser_types:
                try:
                    browser = browser_type.launch(headless=True)
                    page = browser.new_page()
                    
                    search_query = keyword.replace(' ', '+')
                    page.goto(f"https://www.youtube.com/results?search_query={search_query}")
                    
                    # Wait for videos to load
                    page.wait_for_selector('ytd-video-renderer', timeout=10000)
                    
                    video_elements = page.query_selector_all('ytd-video-renderer')
                    
                    videos = []
                    for video_element in video_elements[:5]:
                        try:
                            title_element = video_element.query_selector('#video-title')
                            title = title_element.get_attribute('title') if title_element else "No Title"
                            url_suffix = title_element.get_attribute('href') if title_element else ""
                            url = f"https://www.youtube.com{url_suffix}" if url_suffix else "No URL"
                            
                            channel_name_element = video_element.query_selector('#channel-name .yt-simple-endpoint')
                            channel_name = channel_name_element.inner_text() if channel_name_element else "No Channel Name"
                            
                            metadata_line = video_element.query_selector('#metadata-line')
                            views = "No Views"
                            publish_date = "No Date"
                            if metadata_line:
                                spans = metadata_line.query_selector_all('span')
                                if len(spans) >= 2:
                                    views = spans[0].inner_text()
                                    publish_date = spans[1].inner_text()

                            videos.append({
                                "title": title,
                                "url": url,
                                "channelName": channel_name,
                                "views": views,
                                "publishDate": publish_date,
                            })
                        except Exception as e:
                            print(f"Error processing video element: {e}")
                            continue
                    
                    browser.close()
                    return videos
                    
                except Exception as e:
                    print(f"Failed with browser {browser_type._name}: {e}")
                    continue
            
            return [{
                "title": "Could not fetch videos",
                "url": "#",
                "channelName": "Error",
                "views": "N/A",
                "publishDate": "N/A"
            }]
    except Exception as e:
        print(f"Browser launch error: {e}")
        try:
            return scrape_youtube_videos_http(keyword)
        except Exception as http_error:
            print(f"HTTP fallback scraping failed: {http_error}")
            return [{
                "title": "Could not fetch videos",
                "url": "#",
                "channelName": "Error",
                "views": "N/A",
                "publishDate": "N/A"
            }]

# --- AI Analysis Logic ---
async def get_seo_analysis(keyword: str):
    prompt = f"""
    Analyze the YouTube keyword "{keyword}" and provide a complete SEO analysis in JSON format.
    The JSON object must strictly follow this structure:
    {{
      "metrics": {{
        "searchVolume": "string (e.g., '1.2M searches/month')",
        "competition": "'Low' | 'Medium' | 'High'",
        "overallScore": "number (0-100)",
        "ctr": "string (e.g., '3-5%')",
        "clicks": "string (e.g., '36K-60K')",
        "volume": "number (integer value of searches)",
        "globalVolume": "string (e.g., '2.5M')",
        "rankabilityRating": "'Excellent' | 'Good' | 'Fair' | 'Difficult'",
        "keywordDifficulty": "number (0-100)",
        "trend": "'Growing' | 'Stable' | 'Declining'",
        "suggestedContentType": "string (e.g., 'Tutorial')"
      }},
      "titles": ["string"],
      "descriptions": ["string"],
      "tags": ["string"],
      "scriptOutline": {{
        "hook": "string",
        "introduction": "string",
        "mainPoints": ["string"],
        "callToAction": "string",
        "conclusion": "string"
      }},
      "relatedKeywords": ["string"]
    }}
    """
    
    response = await model.generate_content_async(
        prompt,
        generation_config=genai.GenerationConfig(response_mime_type="application/json")
    )
    return response.text

# --- Cache Configuration ---
# Cache for storing results
keyword_cache: Dict[str, tuple[dict, datetime]] = {}
CACHE_DURATION = timedelta(hours=24)  # Cache results for 24 hours

def get_cached_result(keyword: str) -> dict | None:
    """Get cached result if it exists and is not expired"""
    if keyword in keyword_cache:
        result, timestamp = keyword_cache[keyword]
        if datetime.now() - timestamp < CACHE_DURATION:
            return result
        else:
            # Remove expired cache entry
            del keyword_cache[keyword]
    return None

# --- Main API Endpoint ---
@app.get("/analyze")
async def analyze_keyword(keyword: str = Query(..., min_length=1)):
    try:
        # Check cache first
        cached_result = get_cached_result(keyword.lower())
        if cached_result:
            return cached_result
            
        # If not in cache, generate new results
        with ThreadPoolExecutor() as executor:
            loop = asyncio.get_event_loop()
            videos_future = loop.run_in_executor(executor, scrape_youtube_videos_sync, keyword)
            
            seo_json_str = await get_seo_analysis(keyword)
            videos = await videos_future
            
            seo_data = json.loads(seo_json_str)
            
            # Create result
            result = {
                "seoData": seo_data,
                "videoData": videos
            }
            
            # Store in cache
            keyword_cache[keyword.lower()] = (result, datetime.now())
            
            return result
            
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Add a cache cleanup endpoint (optional)
@app.get("/clear-cache")
async def clear_cache():
    """Clear the keyword cache"""
    keyword_cache.clear()
    return {"message": "Cache cleared"}
