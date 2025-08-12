import os
import time
from typing import Dict, Any, Optional

import requests
from dotenv import load_dotenv
from fastapi import HTTPException
from pydantic import BaseModel

# Build the path to the .env file relative to this file.
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=dotenv_path)


class CacheEntry(BaseModel):
    data: Any
    timestamp: float


KAKAO_REST_API_KEY = os.environ.get("VITE_KAKAO_REST_API_KEY")
OPENWEATHER_API_KEY = os.environ.get("VITE_OPENWEATHER_API_KEY")
KMA_API_KEY = os.environ.get("KMA_API_KEY")

CACHE_TTL_SECONDS = 60 * 10  # 10 minutes
cache: Dict[str, CacheEntry] = {}


def get_from_cache(key: str) -> Optional[Any]:
    if key in cache:
        entry = cache[key]
        if time.time() - entry.timestamp < CACHE_TTL_SECONDS:
            print(f"Backend: Cache hit for {key}")
            return entry.data
    print(f"Backend: Cache miss for {key}")
    return None


def set_in_cache(key: str, data: Any):
    cache[key] = CacheEntry(data=data, timestamp=time.time())


def fetch_external_api(url: str, headers: Optional[Dict[str, str]] = None) -> Any:
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"External API request failed with error: {e}")
        raise HTTPException(status_code=500, detail=f"External API request failed: {e}")


def fetch_external_text_api(url: str, headers: Optional[Dict[str, str]] = None) -> str:
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.text
    except requests.exceptions.RequestException as e:
        print(f"External API request failed with error: {e}")
        raise HTTPException(status_code=500, detail=f"External API request failed: {e}")
