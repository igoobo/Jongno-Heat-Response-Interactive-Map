import os
import json
from typing import List

from openai import OpenAI
from fastapi import APIRouter, HTTPException, Body, Depends
from pydantic import BaseModel

from .api_clients import (
    fetch_external_api,
    fetch_external_text_api,
    get_from_cache,
    set_in_cache,
    KAKAO_REST_API_KEY,
    OPENWEATHER_API_KEY,
    KMA_API_KEY,
    FRIENDLI_TOKENS,
)
from .utils import interpolate_temperatures


class Coordinates(BaseModel):
    lat: float
    lng: float


router = APIRouter()


@router.get("/api/geojson")
def get_geojson():
    geojson_path = os.path.join(os.path.dirname(__file__), 'data', 'jongno_wgs84.geojson')
    with open(geojson_path, 'r', encoding='utf-8') as f:
        return json.load(f)


@router.get("/api/kakao-proxy")
def kakao_proxy(coords: Coordinates = Depends()):
    if not KAKAO_REST_API_KEY:
        raise HTTPException(status_code=500, detail="Kakao REST API key not configured in backend")

    cache_key = f"kakao-{coords.lat}-{coords.lng}"
    cached_data = get_from_cache(cache_key)
    if cached_data:
        return cached_data

    url = f"https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x={coords.lng}&y={coords.lat}"
    headers = {"Authorization": f"KakaoAK {KAKAO_REST_API_KEY}"}
    data = fetch_external_api(url, headers)
    set_in_cache(cache_key, data)
    return data


def _get_weather_data(coords: Coordinates, type: str = "weather"):
    if not OPENWEATHER_API_KEY:
        raise HTTPException(status_code=500, detail="OpenWeather API key not configured in backend")

    if type not in ["weather", "forecast"]:
        raise HTTPException(status_code=400, detail="Invalid weather API type. Use 'weather' or 'forecast'.")

    cache_key = f"weather-{coords.lat}-{coords.lng}-{type}"
    cached_data = get_from_cache(cache_key)
    if cached_data:
        return cached_data

    base_url = "https://api.openweathermap.org/data/2.5/"
    url = f"{base_url}{type}?lat={coords.lat}&lon={coords.lng}&units=metric&appid={OPENWEATHER_API_KEY}"
    if type == "weather":
        url += "&lang=kr"

    data = fetch_external_api(url)
    set_in_cache(cache_key, data)
    return data


@router.get("/api/weather-proxy")
def weather_proxy(coords: Coordinates = Depends(), type: str = "weather"):
    return _get_weather_data(coords, type)


@router.post("/api/polygon-temperatures")
def get_polygon_temperatures(coords_list: List[Coordinates] = Body(...)):
    all_interpolated_temps = []
    for coords in coords_list:
        try:
            hourly_data = weather_proxy(coords=coords, type="forecast")
            original_temps = [item["main"]["temp"] for item in hourly_data["list"][:8]]
            interpolated_1hr = interpolate_temperatures(original_temps)
            all_interpolated_temps.append(interpolated_1hr)
        except HTTPException as e:
            # Log the error and continue to the next coordinate
            print(f"Error fetching weather data for {coords}: {e.detail}")
            all_interpolated_temps.append([])  # Append empty list to indicate failure for this coordinate

    return all_interpolated_temps


import math # Add this import at the top

@router.get("/api/cooling-centers")
def get_cooling_centers():
    cooling_centers_path = os.path.join(os.path.dirname(__file__), 'data', 'seoul_jongno_rest.json')
    with open(cooling_centers_path, 'r', encoding='utf-8') as f:
        return json.load(f)


@router.get("/api/closest-cooling-center")
def get_closest_cooling_center(lat: float, lng: float, facility_type1: str = None): # Add optional facility_type1
    cooling_centers_path = os.path.join(os.path.dirname(__file__), 'data', 'seoul_jongno_rest.json')
    try:
        with open(cooling_centers_path, 'r', encoding='utf-8') as f:
            cooling_centers_data = json.load(f)
        
        filtered_centers = []
        for center in cooling_centers_data.get("DATA", []):
            if facility_type1 is None or center.get("facility_type1") == facility_type1:
                filtered_centers.append(center)

        closest_center = None
        min_distance = float('inf')

        # Haversine formula to calculate distance between two lat/lng points
        def haversine(lat1, lon1, lat2, lon2):
            R = 6371  # Radius of Earth in kilometers

            lat1_rad = math.radians(lat1)
            lon1_rad = math.radians(lon1)
            lat2_rad = math.radians(lat2)
            lon2_rad = math.radians(lon2)

            dlon = lon2_rad - lon1_rad
            dlat = lat2_rad - lat1_rad

            a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2)**2
            c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

            distance = R * c
            return distance

        for center in filtered_centers: # Iterate through filtered centers
            center_lat = float(center.get("lat"))
            center_lng = float(center.get("lon"))
            
            distance = haversine(lat, lng, center_lat, center_lng)
            
            if distance < min_distance:
                min_distance = distance
                closest_center = center
                closest_center["distance_km"] = round(min_distance, 2) # Add distance to the result

        if closest_center:
            return closest_center
        else:
            raise HTTPException(status_code=404, detail="No cooling centers found with the given filter")

    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="seoul_jongno_rest.json not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error decoding seoul_jongno_rest.json")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


import datetime # Add this import at the top

@router.get("/api/kma-temperature-extremes")
def get_kma_temperature_extremes(base_date: str, base_time: str, nx: int = 60, ny: int = 127):
    if not KMA_API_KEY:
        raise HTTPException(status_code=500, detail="KMA_API_KEY not configured in backend")

    url = (
        f"https://apihub.kma.go.kr/api/typ02/openApi/VilageFcstInfoService_2.0/getVilageFcst?"
        f"pageNo=1&numOfRows=200&dataType=JSON&base_date={base_date}&base_time={base_time}&"
        f"nx={nx}&ny={ny}&authKey={KMA_API_KEY}"
    )
    
    try:
        data = fetch_external_api(url)
        
        items = data.get("response", {}).get("body", {}).get("items", {}).get("item", [])
        
        filtered_items = [
            item for item in items 
            if item.get("category") in ["TMX", "TMN"]
        ]
        return filtered_items
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def _fetch_and_parse_kma_warnings():
    if not KMA_API_KEY:
        raise HTTPException(status_code=500, detail="KMA_API_KEY API key not configured in backend")
    
    url = f"https://apihub.kma.go.kr/api/typ01/url/wrn_now_data_new.php?fe=e&tm=&disp=0&help=1&authKey={KMA_API_KEY}"
    try:
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
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from .cache import kma_warnings_cache # Import the global cache

@router.get("/api/kma-weather-warnings")
def get_kma_weather_warnings():
    return kma_warnings_cache["data"]


client = OpenAI(
    api_key=FRIENDLI_TOKENS,
    base_url="https://api.friendli.ai/serverless/v1",
)

@router.get("/api/chat")
def chat():
    # Coordinates for the center of Gwanghwmun
    coords = Coordinates(lat=37.5760, lng=126.9769)
    weather_data = _get_weather_data(coords, type="weather")
    kma_warnings = kma_warnings_cache["data"]
    
    # Extract relevant weather information
    temp = weather_data.get("main", {}).get("temp")
    weather_desc = weather_data.get("weather", [{}])[0].get("description")

    # Prepare KMA warnings string
    warnings_str = ""
    if kma_warnings:
        warnings_list = [w.get("WRN") + " " + w.get("LVL") for w in kma_warnings if w.get("WRN") and w.get("LVL")]
        if warnings_list:
            warnings_str = f" 현재 기상 특보는 다음과 같습니다: {', '.join(warnings_list)}."

    # Prepare the prompt for the language model
    prompt = f"현재 기온은 {temp}°C이고, 날씨는 '{weather_desc}'입니다.{warnings_str} 이 정보를 바탕으로 사용자에게 유용한 정보를 제공해주세요."

    completion = client.chat.completions.create(
        model="K-intelligence/Midm-2.0-Base-Instruct",
        messages=[
            {"role": "system", 
             "content": "당신은 사용자에게 현재 날씨 정보를 기반으로 유용한 조언을 해주는 AI 비서입니다."},
            {"role": "user", 
             "content": prompt},
        ],
    )

    answer = completion.choices[0].message.content
    return {"answer": answer}