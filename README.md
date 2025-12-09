# YouTube SEO Content Generator

AI-powered tool for generating optimized YouTube content and comprehensive SEO suggestions using Google's Gemini API.

## Features

- **Keyword Analysis**: Deep analysis of primary keywords and related terms
- **SEO Metrics**: Comprehensive SEO scoring and optimization recommendations
- **Content Suggestions**: AI-generated titles, descriptions, tags, and script outlines
- **Competitor Analysis**: Top video analysis and competitor insights
- **Related Keywords**: Discovery of long-tail and related keyword opportunities
- **On-Page SEO Recommendations**: Detailed optimization analysis across 6+ categories including keyword density, title optimization, description analysis, tag strategy, readability scoring, and script structure validation

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Playwright, Google Gemini AI
- **Analysis**: Flesch-Kincaid readability algorithm, custom SEO analyzers

## Installation & Setup

### Prerequisites

- Node.js (latest LTS)
- Python 3.11+
- Git

### Frontend Setup

```bash
cd youtube-seo-content-generator
npm install
npm run dev
```

### Backend Setup

```bash
cd youtube-seo-content-generator
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
# source .venv/bin/activate

pip install -r requirements.txt
python run_backend.py
```

### Environment Variables

Create `.env.local` in the root directory:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

## Usage

1. Start both frontend and backend servers
2. Open the application in your browser
3. Enter a YouTube video keyword
4. Select a Gemini model variant
5. Click "Generate" to get comprehensive SEO analysis
6. Review the results including SEO metrics, competitor videos, related keywords, and detailed on-page recommendations

## On-Page SEO Recommendations Feature

### Overview

The On-Page SEO Recommendations system provides comprehensive analysis of AI-generated YouTube content, evaluating optimization across 6+ categories with actionable recommendations and visual score indicators.

### Analysis Categories

| Category | Description | Score Range | Key Metrics |
|----------|-------------|-------------|-------------|
| **Keyword Density** | Primary keyword frequency analysis | Status-based | Optimal: 1-2% |
| **Title Optimization** | Length, keyword placement, clarity | 0-100 | 60-70 chars ideal |
| **Description Optimization** | Length, keywords, CTAs | 0-100 | 150-160 chars (meta) |
| **Tags Optimization** | Count, long-tail keywords, coverage | 0-100 | 10-15 tags optimal |
| **Readability Analysis** | Flesch-Kincaid score and grade level | 0-100 | Grade level 0-16+ |
| **Script Structure** | Keyword distribution, content flow, CTAs | 0-100 | Hook analysis, main points |

### Score Interpretation

- **75-100 (Green)**: Excellent optimization
- **50-74 (Yellow)**: Good, some improvements needed
- **0-49 (Red)**: Significant optimization needed

### Key Recommendations

#### Title Optimization
- 60-70 characters ideal
- Primary keyword in first 30 characters
- Clear, descriptive language
- Avoid excessive punctuation or ALL CAPS

#### Description Optimization
- Include primary keyword naturally
- Add clear call-to-action phrases
- Meta preview: 150-160 characters
- Full description: 300-500 words

#### Tag Strategy
- Use 10-15 tags total
- Include primary keyword
- Use long-tail keywords (2+ word tags)
- Mix branded and search terms

#### Script Structure
- Include primary keyword in hook/introduction
- Provide 3+ main content points
- Include clear call-to-action
- Maintain logical flow

### Readability Standards

| Grade Level | Difficulty | Best For |
|-------------|------------|----------|
| <6 | Easy | General audience |
| 6-9 | Moderate | College level |
| 9-13 | Difficult | Graduate level |
| 13+ | Very Difficult | Professional |

### Technical Implementation

#### Backend Functions (Python/FastAPI)
- `calculate_keyword_density()` - Keyword frequency analysis
- `analyze_title_optimization()` - Title validation and scoring
- `analyze_description_optimization()` - Description analysis
- `optimize_tags()` - Tag strategy evaluation
- `calculate_flesch_kincaid_score()` - Readability scoring
- `analyze_script_structure()` - Script outline validation
- `generate_on_page_recommendations()` - Main orchestrator

#### Frontend Component (React/TypeScript)
- `OnPageRecommendationsDisplay.tsx` - Main component with collapsible sections
- Color-coded scoring system
- Progress bars and detailed metrics
- Responsive design with Tailwind CSS

### Data Flow

```
User Input → API Call → Backend Processing
├── Gemini AI Analysis
├── YouTube Video Scraping
└── On-Page Recommendations Generation
    ├── Keyword Density Analysis
    ├── Title Optimization
    ├── Description Optimization
    ├── Tags Optimization
    ├── Readability Scoring
    └── Script Structure Validation
Frontend Display → SEO Results + Recommendations
```

### Performance

- **First Analysis**: 15-30 seconds
- **Cached Results**: <1 second
- **Recommendation Generation**: <100ms
- **Caching Duration**: 24 hours

## Testing

### Quick Start
1. Ensure backend server is running with GEMINI_API_KEY
2. Start frontend with `npm run dev`
3. Enter a keyword (e.g., "Python for beginners")
4. Click Generate and wait for analysis
5. Verify the On-Page Recommendations section appears with scores and recommendations

### Test Cases
- Short keywords: "python"
- Long keywords: "best practices for learning python programming"
- Technical keywords: "machine learning algorithms"

### Troubleshooting
- **No recommendations showing**: Check API response includes `onPageRecommendations`
- **All scores 0**: Verify keyword is valid and AI response is complete
- **Slow performance**: First run takes time; cached results are fast

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Version**: 1.0  
**Last Updated**: December 7, 2025  
**Status**: Production Ready ✅
