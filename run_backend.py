import os
import uvicorn

# Set the API key
os.environ["GEMINI_API_KEY"] = "AIzaSyDXUF9WP3SpIduObNCEXJD4MQ44iSxbo4E"

if __name__ == "__main__":
    uvicorn.run("backend.scraper:app", host="127.0.0.1", port=8000, reload=True)
