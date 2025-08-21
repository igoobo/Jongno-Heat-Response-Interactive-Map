import os
import time
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import router
from services.kma_service import fetch_and_parse_kma_warnings_data
from services import chat_service
from apscheduler.schedulers.background import BackgroundScheduler # Import scheduler

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting scheduler...")
    scheduler.start()
    # Initial fetch on startup
    update_kma_warnings_cache()
    # Load the RAG pipeline
    chat_service.load_rag_pipeline()
    yield
    print("Shutting down scheduler...")
    scheduler.shutdown()

app = FastAPI(lifespan=lifespan)

# --- 💡 중요: CORS 미들웨어 추가 ---
# 프론트엔드가 다른 주소(예: a.com)에서 백엔드(예: b.com) API를 호출할 수 있도록 허용합니다.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ["*"]는 모든 주소에서의 요청을 허용합니다. 실제 서비스 배포 시에는 보안을 위해 프론트엔드 주소만 명시하는 것이 좋습니다. (예: ["https://my-frontend.com"])
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메소드(GET, POST 등) 허용
    allow_headers=["*"],  # 모든 HTTP 헤더 허용
)
# ------------------------------------

app.include_router(router)

from cache import kma_warnings_cache # Import the global cache

def update_kma_warnings_cache():
    """Fetches KMA warnings and updates the global cache with retry logic."""
    max_retries = 3
    retry_delay = 10  # seconds
    for attempt in range(max_retries):
        try:
            warnings = fetch_and_parse_kma_warnings_data()
            logging.info(f"현재 특보 정보: {warnings}")
            kma_warnings_cache["data"] = warnings
            print("KMA warnings cache updated successfully.")
            return  # Success, exit the function
        except Exception as e:
            print(f"Error updating KMA warnings cache (attempt {attempt + 1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                print(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
            else:
                print("Max retries reached. Failed to update KMA warnings cache.")

# Initialize and start the scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(update_kma_warnings_cache, 'interval', hours=1) # Run every hour


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)