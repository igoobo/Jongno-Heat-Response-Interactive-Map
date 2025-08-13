from typing import Any, Optional, Dict
from fastapi import HTTPException

from ..api_clients import (
    fetch_external_api,
    get_from_cache,
    set_in_cache,
    KAKAO_REST_API_KEY,
    ExternalAPIError # Added this import
)
from ..models import Coordinates

def get_kakao_data(coords: Coordinates) -> Any:
    if not KAKAO_REST_API_KEY:
        raise HTTPException(status_code=500, detail="Kakao REST API key not configured in backend")

    cache_key = f"kakao-{coords.lat}-{coords.lng}"
    cached_data = get_from_cache(cache_key)
    if cached_data:
        return cached_data

    url = f"https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x={coords.lng}&y={coords.lat}"
    headers = {"Authorization": f"KakaoAK {KAKAO_REST_API_KEY}"}
    
    try: # Added try-except block
        data = fetch_external_api(url, headers)
    except ExternalAPIError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    
    set_in_cache(cache_key, data)
    return data