import os
import uvicorn
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

if __name__ == "__main__":
    uvicorn.run("backend.scraper:app", host="127.0.0.1", port=8000, reload=False)
