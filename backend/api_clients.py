from typing import Dict, Any, Optional
import os
import time
import httpx


from dotenv import load_dotenv
from pydantic import BaseModel

# Define a custom exception for external API errors
class ExternalAPIError(Exception):
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

# Build the path to the .env file relative to this file.
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=dotenv_path)


class CacheEntry(BaseModel):
    data: Any
    timestamp: float


KAKAO_REST_API_KEY = os.environ.get("KAKAO_REST_API_KEY")
OPENWEATHER_API_KEY = os.environ.get("OPENWEATHER_API_KEY")
KMA_API_KEY = os.environ.get("KMA_API_KEY")
FRIENDLI_TOKENS = os.environ.get("FRIENDLI_TOKENS")

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


# Create a global httpx client for connection pooling
client = httpx.Client()

def fetch_external_api(url: str, headers: Optional[Dict[str, str]] = None) -> Any:
    try:
        response = client.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except httpx.RequestError as e:
        print(f"External API request failed with error: {e}")
        raise ExternalAPIError(message=f"External API request failed: {e}", status_code=500)


def fetch_external_text_api(url: str, headers: Optional[Dict[str, str]] = None) -> str:
    try:
        response = client.get(url, headers=headers)
        response.raise_for_status()
        return response.text
    except httpx.RequestError as e:
        print(f"External API request failed with error: {e}")
        raise ExternalAPIError(message=f"External API request failed: {e}", status_code=500)
