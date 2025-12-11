import os
import uvicorn
from dotenv import load_dotenv

# Load environment variables from .env so the API key does not have to be hardcoded
load_dotenv()

if __name__ == "__main__":
    if not os.environ.get("GEMINI_API_KEY"):
        raise RuntimeError("GEMINI_API_KEY is not set. Add it to .env before starting the backend.")
    uvicorn.run("backend.scraper:app", host="127.0.0.1", port=8000, reload=True)
