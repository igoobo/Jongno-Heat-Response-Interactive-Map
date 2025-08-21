import os
import json
from typing import Any, List
from fastapi import HTTPException

from api_clients import fetch_external_api, fetch_external_text_api, ExternalAPIError # Added this import
from cache import kma_warnings_cache

def get_kma_temperature_extremes_data(base_date: str, base_time: str, nx: int = 60, ny: int = 127) -> List[Any]:
    if not os.environ.get("KMA_API_KEY"):
        raise HTTPException(status_code=500, detail="KMA_API_KEY not configured in backend")

    url = (
        f"https://apihub.kma.go.kr/api/typ02/openApi/VilageFcstInfoService_2.0/getVilageFcst?"
        f"pageNo=1&numOfRows=200&dataType=JSON&base_date={base_date}&base_time={base_time}&"
        f"nx={nx}&ny={ny}&authKey={os.environ.get("KMA_API_KEY")}"
    )
    
    try: # Added try-except block
        data = fetch_external_api(url)
        
        items = data.get("response", {}).get("body", {}).get("items", {}).get("item", [])
        
        filtered_items = [
            item for item in items 
            if item.get("category") in ["TMX", "TMN"]
        ]
        return filtered_items
    except ExternalAPIError as e: # Catch ExternalAPIError
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e: # Keep general exception for other errors
        raise HTTPException(status_code=500, detail=str(e))

def fetch_and_parse_kma_warnings_data() -> List[Any]:
    if not os.environ.get("KMA_API_KEY"):
        raise HTTPException(status_code=500, detail="KMA_API_KEY API key not configured in backend")
    
    url = f"https://apihub.kma.go.kr/api/typ01/url/wrn_now_data_new.php?fe=e&tm=&disp=0&help=1&authKey={os.environ.get("KMA_API_KEY")}"
    try: # Added try-except block
        response_text = fetch_external_text_api(url)
        lines = response_text.splitlines()
        
        # Find the start of the data
        data_start_index = -1
        for i, line in enumerate(lines):
            if line.strip() == "#START7777":
                data_start_index = i + 2  # Skip the header line
                break
        
        if data_start_index == -1: 
            return {"error": "Could not find the start of the data"}

        # Parse and filter the data
        filtered_data = []
        for line in lines[data_start_index:]:
            if not line.strip() or line.startswith("#"):
                continue
            
            parts = [p.strip() for p in line.split(",")]
            if len(parts) >= 10 and parts[0] == "L1100000" and parts[6] == "폭염":
                filtered_data.append({
                    "REG_UP": parts[0],
                    "REG_UP_KO": parts[1],
                    "REG_ID": parts[2],
                    "REG_KO": parts[3],
                    "TM_FC": parts[4],
                    "TM_EF": parts[5],
                    "WRN": parts[6],
                    "LVL": parts[7],
                    "CMD": parts[8],
                    "ED_TM": parts[9],
                })
        
        return filtered_data
    except ExternalAPIError as e: # Catch ExternalAPIError
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e: # Keep general exception for other errors
        raise HTTPException(status_code=500, detail=str(e))

def get_cached_kma_warnings_data() -> Any:
    return kma_warnings_cache["data"]
