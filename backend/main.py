import os

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from .routes import router, _fetch_and_parse_kma_warnings # Import the new function
from apscheduler.schedulers.background import BackgroundScheduler # Import scheduler

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting scheduler...")
    scheduler.start()
    # Initial fetch on startup
    update_kma_warnings_cache()
    yield
    print("Shutting down scheduler...")
    scheduler.shutdown()

app = FastAPI(lifespan=lifespan)
app.include_router(router)

from .cache import kma_warnings_cache # Import the global cache

def update_kma_warnings_cache():
    """Fetches KMA warnings and updates the global cache."""
    try:
        warnings = _fetch_and_parse_kma_warnings()
        kma_warnings_cache["data"] = warnings
        print("KMA warnings cache updated successfully.")
    except Exception as e:
        print(f"Error updating KMA warnings cache: {e}")

# Initialize and start the scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(update_kma_warnings_cache, 'interval', hours=1) # Run every hour


# Serve frontend
static_files_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
app.mount("/", StaticFiles(directory=static_files_path, html=True), name="static")


@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    return FileResponse(os.path.join(static_files_path, "index.html"))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
