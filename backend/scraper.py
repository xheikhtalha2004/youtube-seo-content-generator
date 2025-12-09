import os
import asyncio
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from playwright.async_api import async_playwright
from playwright.sync_api import sync_playwright
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
import threading
from concurrent.futures import ThreadPoolExecutor
from typing import Dict, List
import json
from datetime import datetime, timedelta
import re
from collections import Counter

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
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY environment variable not set.")

genai.configure(api_key=api_key)

# Allowed Gemini models for dynamic selection
ALLOWED_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash']
DEFAULT_MODEL = 'gemini-2.5-flash'

# --- Web Scraping Logic ---
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
                    await page.goto(f"https://www.youtube.com/results?search_query={search_query}", timeout=30000)
                    
                    # Wait for videos to load with longer timeout
                    await page.wait_for_selector('ytd-video-renderer', timeout=15000)
                    
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
            return [{
                "title": "Could not fetch videos",
                "url": "#",
                "channelName": "Error",
                "views": "N/A",
                "publishDate": "N/A"
            }]
                
    except Exception as e:
        print(f"Browser launch error: {e}")
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
                    page.goto(f"https://www.youtube.com/results?search_query={search_query}", timeout=30000)
                    
                    # Wait for videos to load with longer timeout
                    page.wait_for_selector('ytd-video-renderer', timeout=15000)
                    
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
                    print(f"Failed with browser {browser_type.name}: {e}")
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
        return [{
            "title": "Could not fetch videos",
            "url": "#",
            "channelName": "Error",
            "views": "N/A",
            "publishDate": "N/A"
        }]

# --- AI Analysis Logic ---
async def get_seo_analysis(keyword: str, model_name: str = DEFAULT_MODEL):
    # Initialize model dynamically with error handling
    model = None
    try:
        model = genai.GenerativeModel(model_name)
    except Exception as e:
        print(f"Failed to initialize model {model_name}: {e}")
        # Fallback to default model
        try:
            model = genai.GenerativeModel(DEFAULT_MODEL)
            print(f"Fell back to default model: {DEFAULT_MODEL}")
        except Exception as fallback_e:
            print(f"Failed to initialize default model {DEFAULT_MODEL}: {fallback_e}")
            raise ValueError(f"Could not initialize any Gemini model. Please check your API key and model availability.")

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

# -----------------------------------------------------------------------------
# New helper functions for content generation and real SEO metrics
#
# The original `get_seo_analysis` function asked Gemini to fabricate both metrics
# and content. To provide more realistic SEO insights, we now generate content
# separately and compute metrics from the scraped competitor videos. The helper
# functions below parse human-formatted view counts and publish dates, derive
# simple metrics such as competition level, search volume and trend, and then
# build a metrics dictionary compatible with the front‑end.

def _parse_views(views_str: str) -> int:
    """Convert a YouTube view count string into an integer.

    Examples
    --------
    >>> _parse_views("1.2M views")
    1200000
    >>> _parse_views("3.4K views")
    3400
    >>> _parse_views("953 views")
    953

    Parameters
    ----------
    views_str : str
        String describing the number of views, e.g. '1.2M views' or 'No Views'.

    Returns
    -------
    int
        Approximate numeric view count (0 if parsing fails).
    """
    if not views_str or 'no' in views_str.lower():
        return 0
    # Remove commas and the word 'views'
    clean = views_str.lower().replace('views', '').strip()
    # Remove any non-alphanumeric and non-decimal separators
    clean = clean.replace(',', '')
    try:
        # Handle units: k, m, b
        multiplier = 1
        if clean.endswith('k'):
            multiplier = 1000
            clean = clean[:-1]
        elif clean.endswith('m'):
            multiplier = 1_000_000
            clean = clean[:-1]
        elif clean.endswith('b'):
            multiplier = 1_000_000_000
            clean = clean[:-1]
        value = float(clean)
        return int(value * multiplier)
    except ValueError:
        # Fallback: extract digits
        digits = ''.join(ch for ch in clean if ch.isdigit())
        return int(digits) if digits else 0


def _parse_publish_date(date_str: str) -> float | None:
    """Convert a publish date string like '2 weeks ago' to an approximate number of days ago.

    If the string cannot be parsed, None is returned.

    Parameters
    ----------
    date_str : str
        Publish date string from YouTube, e.g. '5 years ago', '3 months ago', '1 week ago',
        'Streamed 2 months ago'.

    Returns
    -------
    float | None
        Number of days since publication (approximate), or None if parsing fails.
    """
    if not date_str or 'no' in date_str.lower():
        return None
    # Normalize and remove words like 'streamed'
    s = date_str.lower().replace('streamed', '').replace('ago', '').strip()
    parts = s.split()
    if not parts:
        return None
    # Expect format: number unit
    try:
        value = float(parts[0])
    except ValueError:
        return None
    # Determine the unit
    unit = parts[1] if len(parts) > 1 else 'day'
    if 'year' in unit:
        return value * 365
    if 'month' in unit:
        return value * 30
    if 'week' in unit:
        return value * 7
    if 'day' in unit:
        return value
    if 'hour' in unit:
        return value / 24
    if 'minute' in unit:
        return value / (24 * 60)
    return None


def _human_readable_number(num: int) -> str:
    """Convert an integer into a human‑readable string with units (K, M, B)."""
    if num >= 1_000_000_000:
        return f"{num / 1_000_000_000:.1f}B"
    if num >= 1_000_000:
        return f"{num / 1_000_000:.1f}M"
    if num >= 1_000:
        return f"{num / 1_000:.1f}K"
    return str(num)


def compute_competitor_metrics(videos: List[dict], keyword: str) -> dict:
    """Compute simple SEO metrics based on scraped competitor videos.

    This function derives search volume, competition, keyword difficulty,
    overall score and trend from the list of competitor videos. It also
    suggests a content type based on keywords in competitor titles.

    Parameters
    ----------
    videos : list of dict
        Video dictionaries as returned by `scrape_youtube_videos_sync`, containing keys
        'title', 'views' and 'publishDate'.
    keyword : str
        The search keyword used for scraping; used in suggested content type heuristics.

    Returns
    -------
    dict
        A metrics dictionary matching the expected front‑end structure.
    """
    # Parse views and publish dates
    view_counts: List[int] = []
    days_since_pub: List[float] = []
    for v in videos:
        view = _parse_views(v.get('views', ''))
        if view > 0:
            view_counts.append(view)
        day = _parse_publish_date(v.get('publishDate', ''))
        if day is not None:
            days_since_pub.append(day)

    # Derive volume metrics
    total_views = sum(view_counts)
    avg_views = total_views / len(view_counts) if view_counts else 0
    # Determine competition category
    if len(view_counts) >= 5 and avg_views >= 500_000:
        competition = 'High'
        difficulty = 80
    elif avg_views >= 100_000:
        competition = 'Medium'
        difficulty = 60
    else:
        competition = 'Low'
        difficulty = 30
    # Cap difficulty within 0-100
    difficulty = min(max(int(difficulty), 0), 100)
    # Compute overall score as inverse of difficulty with slight boost for low competition
    overall_score = max(0, min(100, 100 - difficulty + (10 if competition == 'Low' else 0)))
    # Determine trend based on median publish date
    trend = 'Stable'
    if days_since_pub:
        sorted_days = sorted(days_since_pub)
        median_days = sorted_days[len(sorted_days) // 2]
        if median_days <= 90:
            trend = 'Growing'
        elif median_days >= 365:
            trend = 'Declining'
        else:
            trend = 'Stable'
    # Suggest content type by checking common words in titles
    title_text = ' '.join(v.get('title', '').lower() for v in videos)
    content_types = ['tutorial', 'guide', 'review', 'unboxing', 'vlog', 'podcast']
    counts = {ct: title_text.count(ct) for ct in content_types}
    suggested_type = max(counts, key=counts.get) if any(counts.values()) else 'Video'
    # Rankability rating based on difficulty
    if difficulty < 30:
        rankability = 'Excellent'
    elif difficulty < 60:
        rankability = 'Good'
    elif difficulty < 80:
        rankability = 'Fair'
    else:
        rankability = 'Difficult'
    # Build metrics dictionary
    metrics = {
        'searchVolume': _human_readable_number(total_views) + ' views',
        'competition': competition,
        'overallScore': int(overall_score),
        'ctr': 'N/A',
        'clicks': 'N/A',
        'volume': total_views,
        'globalVolume': _human_readable_number(total_views),
        'rankabilityRating': rankability,
        'keywordDifficulty': difficulty,
        'trend': trend,
        'suggestedContentType': suggested_type.capitalize(),
    }
    return metrics


async def generate_ai_content(keyword: str, model_name: str = DEFAULT_MODEL) -> str:
    """
    Generate detailed YouTube content suggestions using Gemini.

    This function asks the model to create several titles, a long and detailed description,
    a list of relevant tags, a structured script outline, and related keywords. It does
    not request any SEO metrics since those will be computed from competitor data.

    Parameters
    ----------
    keyword : str
        The primary keyword/topic to generate content for.
    model_name : str, optional
        The name of the Gemini model to use. If initialization fails, the default model is used.

    Returns
    -------
    str
        JSON-formatted string containing content suggestions.
    """
    model = None
    try:
        model = genai.GenerativeModel(model_name)
    except Exception as e:
        print(f"Failed to initialize model {model_name}: {e}")
        try:
            model = genai.GenerativeModel(DEFAULT_MODEL)
            print(f"Fell back to default model: {DEFAULT_MODEL}")
        except Exception as fallback_e:
            print(f"Failed to initialize default model {DEFAULT_MODEL}: {fallback_e}")
            raise ValueError(
                "Could not initialize any Gemini model. Please check your API key and model availability."
            )
    prompt = (
        f"You are an expert YouTube content strategist.\n"
        f"Given the keyword '{keyword}', generate highly detailed content suggestions in JSON format.\n"
        f"Your response must be valid JSON with the following structure:\n"
        f"{{\n"
        f"  \"titles\": [\n"
        f"    // Provide 5 catchy and SEO-friendly video titles using the keyword.\n"
        f"  ],\n"
        f"  \"descriptions\": [\n"
        f"    // Provide a single long video description of at least 2-3 paragraphs with rich details,\n"
        f"    // using natural language, relevant subtopics, and calls to action.\n"
        f"  ],\n"
        f"  \"tags\": [\n"
        f"    // Provide 10-15 tags that include the keyword, long-tail variants, and related concepts.\n"
        f"  ],\n"
        f"  \"scriptOutline\": {{\n"
        f"    // Provide a script outline with the following fields: 'hook', 'introduction',\n"
        f"    // 'mainPoints' (list of at least 4 points), 'callToAction', and 'conclusion'.\n"
        f"    // Each field should be detailed and incorporate the keyword naturally.\n"
        f"  }},\n"
        f"  \"relatedKeywords\": [\n"
        f"    // Provide 5-8 related keywords or topics that are semantically connected to the main keyword.\n"
        f"  ]\n"
        f"}}\n"
        f"\n"
        f"Ensure your JSON output includes all the requested keys. Do not include any 'metrics' section."
    )
    try:
        response = await model.generate_content_async(
            prompt,
            generation_config=genai.GenerationConfig(response_mime_type="application/json")
        )
        return response.text
    except Exception as e:
        print(f"AI content generation failed: {e}")
        fallback_content = {
            "titles": [
                f"{keyword} Tutorial: Everything You Need to Know",
                f"Top Tips for {keyword}",
                f"Beginner's Guide to {keyword}",
                f"How to Master {keyword} Quickly",
                f"{keyword}: The Ultimate Overview",
            ],
            "descriptions": [
                f"This video provides an in-depth overview of {keyword}. We'll cover what {keyword} is, why it's important, and how you can get started. You'll learn key concepts, best practices, and insider tips to help you succeed."
            ],
            "tags": [keyword, f"{keyword} guide", f"learn {keyword}", f"{keyword} tutorial", f"{keyword} tips"],
            "scriptOutline": {
                "hook": f"Want to learn about {keyword}? Stay tuned!",
                "introduction": f"In this video, we'll explore {keyword} in detail.",
                "mainPoints": [
                    f"What is {keyword}?",
                    f"Why {keyword} matters",
                    f"Key aspects of {keyword}",
                    f"How to get started with {keyword}"
                ],
                "callToAction": "Like and subscribe for more content!",
                "conclusion": f"Now you have the basics of {keyword}!"
            },
            "relatedKeywords": []
        }
        return json.dumps(fallback_content)

# --- On-Page SEO Recommendations Logic ---

def calculate_keyword_density(text: str, keyword: str) -> dict:
    """Calculate keyword density in text"""
    if not text or not keyword:
        return {"density": 0.0, "count": 0, "wordCount": 0, "status": "insufficient_data"}
    
    # Normalize text and keyword
    text_lower = text.lower()
    keyword_lower = keyword.lower()
    
    # Count words
    words = text_lower.split()
    word_count = len(words)
    
    if word_count == 0:
        return {"density": 0.0, "count": 0, "wordCount": 0, "status": "insufficient_data"}
    
    # Count keyword occurrences (whole word matching)
    keyword_pattern = r'\b' + re.escape(keyword_lower) + r'\b'
    keyword_count = len(re.findall(keyword_pattern, text_lower))
    
    # Calculate density
    density = (keyword_count / word_count) * 100
    
    # Determine status
    if density < 0.5:
        status = "too_low"
    elif density > 2.5:
        status = "too_high"
    else:
        status = "optimal"
    
    return {
        "density": round(density, 2),
        "count": keyword_count,
        "wordCount": word_count,
        "status": status,
        "recommendation": get_density_recommendation(density)
    }

def get_density_recommendation(density: float) -> str:
    """Get keyword density recommendation"""
    if density < 0.5:
        return "Keyword density is too low. Try incorporating the keyword more naturally in your content."
    elif density > 2.5:
        return "Keyword density is too high. Reduce keyword stuffing for better readability and SEO."
    else:
        return "Keyword density is in the optimal range (1-2%)."

def analyze_title_optimization(title: str, keyword: str) -> dict:
    """Analyze title optimization"""
    recommendations = []
    score = 100
    
    # Check length (ideal: 60-70 characters)
    title_length = len(title)
    if title_length < 30:
        recommendations.append("Title is too short. Consider extending it to at least 30 characters.")
        score -= 15
    elif title_length > 70:
        recommendations.append(f"Title is {title_length} characters. Consider keeping it under 70 characters for optimal display.")
        score -= 10
    else:
        recommendations.append(f"Title length ({title_length} chars) is within optimal range.")
    
    # Check keyword placement (should appear in first 30 characters)
    keyword_lower = keyword.lower()
    title_lower = title.lower()
    first_30_chars = title_lower[:30]
    
    if keyword_lower in first_30_chars:
        recommendations.append("Primary keyword appears in the first 30 characters. Great for SEO!")
    else:
        recommendations.append(f"Primary keyword '{keyword}' is not in the first 30 characters. Consider moving it forward.")
        score -= 15
    
    # Check clarity (based on punctuation and structure)
    clarity_score = 100
    
    # Penalize excessive punctuation
    punct_count = sum(1 for char in title if char in '!?;:')
    if punct_count > 2:
        clarity_score -= 10
        recommendations.append("Title has excessive punctuation. Keep it clear and concise.")
    
    # Check for common clarity issues
    if title.isupper():
        clarity_score -= 15
        recommendations.append("Title is in all caps. Use normal capitalization for better readability.")
    
    score = max(0, min(100, (score + clarity_score) // 2))
    
    return {
        "score": score,
        "length": title_length,
        "keywordInFirst30": keyword_lower in first_30_chars,
        "recommendations": recommendations
    }

def analyze_description_optimization(description: str, keyword: str) -> dict:
    """Analyze description optimization"""
    recommendations = []
    score = 100
    
    # Check character count
    char_count = len(description)
    word_count = len(description.split())
    
    if char_count < 120:
        recommendations.append(f"Description is too short ({char_count} chars). Aim for 150-160 characters minimum for meta descriptions.")
        score -= 15
    elif char_count > 200:
        recommendations.append(f"Description preview may be cut off ({char_count} chars). Keep meta descriptions under 160 characters; however, longer descriptions in video descriptions are beneficial.")
    else:
        recommendations.append(f"Description length ({char_count} chars) is good for meta preview.")
    
    # Check keyword usage
    density_info = calculate_keyword_density(description, keyword)
    if density_info["count"] == 0:
        recommendations.append(f"Primary keyword '{keyword}' is not in the description. Include it naturally at least once.")
        score -= 20
    else:
        recommendations.append(f"Primary keyword found {density_info['count']} time(s) in description.")
    
    # Check for CTA
    cta_keywords = ['watch', 'subscribe', 'click', 'learn', 'visit', 'check', 'read', 'explore', 'discover', 'join']
    has_cta = any(cta in description.lower() for cta in cta_keywords)
    
    if has_cta:
        recommendations.append("Description includes a call-to-action. Great for engagement!")
    else:
        recommendations.append("Consider adding a call-to-action (e.g., 'Subscribe', 'Learn more', 'Watch now') to boost engagement.")
        score -= 10
    
    score = max(0, min(100, score))
    
    return {
        "score": score,
        "characterCount": char_count,
        "wordCount": word_count,
        "hasKeyword": density_info["count"] > 0,
        "keywordCount": density_info["count"],
        "hasCTA": has_cta,
        "recommendations": recommendations
    }

def optimize_tags(tags: List[str], keyword: str) -> dict:
    """Optimize tags"""
    recommendations = []
    score = 100
    
    # Check tag count
    tag_count = len(tags)
    if tag_count < 5:
        recommendations.append(f"You have {tag_count} tags. Aim for 10-15 tags to maximize reach.")
        score -= 15
    elif tag_count > 20:
        recommendations.append(f"You have {tag_count} tags. Consider reducing to 10-15 tags to avoid tag stuffing.")
        score -= 10
    else:
        recommendations.append(f"Tag count ({tag_count}) is within optimal range.")
    
    # Check keyword coverage
    keyword_lower = keyword.lower()
    keyword_found_in_tags = any(keyword_lower in tag.lower() for tag in tags)
    
    if keyword_found_in_tags:
        recommendations.append("Primary keyword is included in tags. Good for discoverability!")
    else:
        recommendations.append(f"Consider adding the primary keyword '{keyword}' as a tag.")
        score -= 10
    
    # Check for long-tail keywords (tags with 2+ words)
    long_tail_tags = [tag for tag in tags if len(tag.split()) > 1]
    if len(long_tail_tags) < 3:
        recommendations.append(f"You have {len(long_tail_tags)} long-tail tags. Consider adding more multi-word tags for better targeting.")
        score -= 5
    else:
        recommendations.append(f"Good variety of long-tail tags ({len(long_tail_tags)} found).")
    
    # Check brand vs. search terms ratio
    brand_keywords = ['tutorial', 'guide', 'how to', 'tips', 'tricks', 'best', 'top']
    branded_tags = [tag for tag in tags if any(bk in tag.lower() for bk in brand_keywords)]
    
    score = max(0, min(100, score))
    
    return {
        "score": score,
        "count": tag_count,
        "hasKeyword": keyword_found_in_tags,
        "longTailCount": len(long_tail_tags),
        "recommendations": recommendations
    }

def calculate_flesch_kincaid_score(text: str) -> dict:
    """Calculate Flesch-Kincaid readability score"""
    if not text or len(text.strip()) == 0:
        return {"score": 0, "grade": "N/A", "difficulty": "N/A"}
    
    # Count sentences
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if s.strip()]
    sentence_count = len(sentences)
    
    if sentence_count == 0:
        return {"score": 0, "grade": "N/A", "difficulty": "N/A"}
    
    # Count words
    words = text.split()
    word_count = len(words)
    
    if word_count == 0:
        return {"score": 0, "grade": "N/A", "difficulty": "N/A"}
    
    # Count syllables (simplified approach)
    syllable_count = count_syllables(text)
    
    # Flesch-Kincaid Grade Level formula
    # 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59
    grade_level = (0.39 * (word_count / sentence_count) + 
                   11.8 * (syllable_count / word_count) - 15.59)
    
    grade_level = max(0, grade_level)  # Ensure non-negative
    
    # Convert to difficulty
    if grade_level < 6:
        difficulty = "Easy (High School)"
    elif grade_level < 9:
        difficulty = "Moderate (College)"
    elif grade_level < 13:
        difficulty = "Difficult (Graduate)"
    else:
        difficulty = "Very Difficult (Professional)"
    
    # Convert grade to Flesch score (approximate inverse)
    flesch_score = max(0, min(100, 206.835 - 1.015 * (word_count / sentence_count) - 84.6 * (syllable_count / word_count)))
    
    return {
        "score": round(flesch_score, 1),
        "gradeLevel": round(grade_level, 1),
        "difficulty": difficulty,
        "sentenceCount": sentence_count,
        "wordCount": word_count,
        "syllableCount": syllable_count
    }

def count_syllables(text: str) -> int:
    """Simplified syllable counting"""
    word_list = text.lower().split()
    syllable_count = 0
    vowels = "aeiouy"
    
    for word in word_list:
        # Remove punctuation
        word = re.sub(r'[^a-z]', '', word)
        
        if len(word) <= 3:
            syllable_count += 1
        else:
            # Count vowel groups
            previous_was_vowel = False
            for char in word:
                is_vowel = char in vowels
                if is_vowel and not previous_was_vowel:
                    syllable_count += 1
                previous_was_vowel = is_vowel
            
            # Adjust for silent e
            if word.endswith('e'):
                syllable_count -= 1
            
            # Adjust for -le words
            if word.endswith('le') and len(word) > 2 and word[-3] not in vowels:
                syllable_count += 1
    
    return max(1, syllable_count)

def analyze_script_structure(script_outline: dict, keyword: str) -> dict:
    """Analyze script outline structure for keyword distribution"""
    recommendations = []
    score = 100
    
    # Combine key parts into sections
    hook = script_outline.get("hook", "")
    introduction = script_outline.get("introduction", "")
    main_points = script_outline.get("mainPoints", [])
    cta = script_outline.get("callToAction", "")
    conclusion = script_outline.get("conclusion", "")
    
    # Check for keyword in hook/intro (H1 equivalent)
    h1_equivalent = hook + " " + introduction
    keyword_lower = keyword.lower()
    h1_has_keyword = keyword_lower in h1_equivalent.lower()
    
    if h1_has_keyword:
        recommendations.append("Primary keyword is in the hook/introduction. Excellent for SEO impact!")
    else:
        recommendations.append(f"Consider adding the primary keyword '{keyword}' to the hook or introduction for stronger SEO impact.")
        score -= 15
    
    # Check main points for related keywords
    main_points_text = " ".join(main_points).lower()
    main_points_have_variety = len(set(main_points)) == len(main_points)
    
    if len(main_points) >= 3:
        recommendations.append(f"Script has {len(main_points)} main points. Good structure for comprehensive content.")
    else:
        recommendations.append("Consider adding more main points (3+) for deeper content coverage.")
        score -= 10
    
    # Check for CTA
    if cta and len(cta.strip()) > 0:
        recommendations.append("Script includes a call-to-action. Good for viewer engagement!")
    else:
        recommendations.append("Add a clear call-to-action to encourage viewer engagement (subscribe, comment, etc.).")
        score -= 10
    
    score = max(0, min(100, score))
    
    return {
        "score": score,
        "hasKeywordInHook": h1_has_keyword,
        "mainPointsCount": len(main_points),
        "hasMainPoints": len(main_points) > 0,
        "hasCTA": len(cta.strip()) > 0,
        "recommendations": recommendations
    }

def generate_on_page_recommendations(seo_data: dict, keyword: str) -> dict:
    """Generate comprehensive on-page SEO recommendations"""
    
    # Extract data
    titles = seo_data.get("titles", [])
    descriptions = seo_data.get("descriptions", [])
    tags = seo_data.get("tags", [])
    script_outline = seo_data.get("scriptOutline", {})
    
    # Use first title/description as primary
    primary_title = titles[0] if titles else ""
    primary_description = descriptions[0] if descriptions else ""
    
    # Analyze each component
    title_analysis = analyze_title_optimization(primary_title, keyword)
    description_analysis = analyze_description_optimization(primary_description, keyword)
    tags_analysis = optimize_tags(tags, keyword)
    
    # Analyze primary title for readability
    title_readability = calculate_flesch_kincaid_score(primary_title)
    
    # Analyze primary description for readability
    description_readability = calculate_flesch_kincaid_score(primary_description)
    
    # Analyze script structure
    script_analysis = analyze_script_structure(script_outline, keyword)
    
    # Calculate keyword density for each component
    title_density = calculate_keyword_density(primary_title, keyword)
    description_density = calculate_keyword_density(primary_description, keyword)
    tags_text = " ".join(tags)
    tags_density = calculate_keyword_density(tags_text, keyword)
    
    # Calculate overall score (average of all component scores)
    component_scores = [
        title_analysis["score"],
        description_analysis["score"],
        tags_analysis["score"],
        script_analysis["score"],
        title_readability.get("score", 50),
        description_readability.get("score", 50)
    ]
    overall_score = round(sum(component_scores) / len(component_scores), 1)
    
    return {
        "overallScore": overall_score,
        "keywordDensity": {
            "title": title_density,
            "description": description_density,
            "tags": tags_density,
            "summary": f"Primary keyword appears {title_density['count']} time(s) in title, {description_density['count']} time(s) in description, {tags_density['count']} time(s) in tags."
        },
        "titleOptimization": title_analysis,
        "descriptionOptimization": description_analysis,
        "tagsOptimization": tags_analysis,
        "scriptStructure": script_analysis,
        "titleReadability": title_readability,
        "descriptionReadability": description_readability,
        "allRecommendations": (
            title_analysis.get("recommendations", []) +
            description_analysis.get("recommendations", []) +
            tags_analysis.get("recommendations", []) +
            script_analysis.get("recommendations", [])
        )
    }

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
async def analyze_keyword(keyword: str = Query(..., min_length=1), model: str = Query(DEFAULT_MODEL)):
    try:
        # Validate model parameter
        if model not in ALLOWED_MODELS:
            model = DEFAULT_MODEL

        # Check cache first
        cached_result = get_cached_result(keyword.lower())
        if cached_result:
            return cached_result

        # If not in cache, generate new results
        # Run the video scrape in a separate thread to avoid blocking the event loop
        with ThreadPoolExecutor() as executor:
            loop = asyncio.get_event_loop()
            videos_future = loop.run_in_executor(executor, scrape_youtube_videos_sync, keyword)

            # Generate detailed content using the AI model concurrently
            content_task = asyncio.create_task(generate_ai_content(keyword, model))

            # Wait for both tasks to complete
            videos = await videos_future
            content_json_str = await content_task

            # Parse AI content JSON
            try:
                content_data = json.loads(content_json_str)
            except json.JSONDecodeError as e:
                print(f"Failed to parse AI content JSON: {e}")
                content_data = {
                    "titles": [],
                    "descriptions": [],
                    "tags": [],
                    "scriptOutline": {},
                    "relatedKeywords": []
                }

            # Compute real SEO metrics from competitor videos
            metrics = compute_competitor_metrics(videos, keyword)

            # Build seo_data using AI content and computed metrics
            seo_data = {
                "metrics": metrics,
                "titles": content_data.get("titles", []),
                "descriptions": content_data.get("descriptions", []),
                "tags": content_data.get("tags", []),
                "scriptOutline": content_data.get("scriptOutline", {}),
                "relatedKeywords": content_data.get("relatedKeywords", []),
            }

            # Generate on-page recommendations based on the combined data
            on_page_recommendations = generate_on_page_recommendations(seo_data, keyword)

            # Create result object for front‑end
            result = {
                "seoData": seo_data,
                "videoData": videos,
                "onPageRecommendations": on_page_recommendations
            }

            # Store in cache
            keyword_cache[keyword.lower()] = (result, datetime.now())

            return result

    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- Custom Analysis Endpoint ---
@app.post("/analyze-custom")
async def analyze_custom(data: dict):
    try:
        custom_titles = data.get("custom_titles", [])
        custom_description = data.get("custom_description", "")
        custom_tags = data.get("custom_tags", [])
        custom_script = data.get("custom_script", "")
        keyword = data.get("keyword", "")

        if not keyword:
            raise HTTPException(status_code=400, detail="Keyword is required")

        # Scrape videos for the keyword
        with ThreadPoolExecutor() as executor:
            loop = asyncio.get_event_loop()
            videos_future = loop.run_in_executor(executor, scrape_youtube_videos_sync, keyword)
            videos = await videos_future

        # Compute real metrics based on competitor videos
        metrics = compute_competitor_metrics(videos, keyword)

        # Construct seoData from custom content combined with real metrics
        seo_data = {
            "metrics": metrics,
            "titles": custom_titles,
            "descriptions": [custom_description] if custom_description else [],
            "tags": custom_tags,
            "scriptOutline": {
                "hook": "",
                "introduction": custom_script,
                "mainPoints": [],
                "callToAction": "",
                "conclusion": ""
            },
            "relatedKeywords": []
        }

        # Generate on-page recommendations
        on_page_recommendations = generate_on_page_recommendations(seo_data, keyword)

        # Create result
        result = {
            "seoData": seo_data,
            "videoData": videos,
            "onPageRecommendations": on_page_recommendations
        }

        return result

    except Exception as e:
        print(f"An error occurred in custom analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Add a cache cleanup endpoint (optional)
@app.get("/clear-cache")
async def clear_cache():
    """Clear the keyword cache"""
    keyword_cache.clear()
    return {"message": "Cache cleared"}