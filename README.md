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

- Node.js
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
pip install -r requirements.txt
python run_backend.py
```

### Environment Variables

Create `.env.local` with:

```
GEMINI_API_KEY=your_api_key_here
```

## Usage

1. Enter a keyword
2. Get SEO analysis and content suggestions
3. View competitor videos
4. Explore related keywords
