import os
import json
from typing import List

from fastapi import APIRouter, HTTPException, Body, Depends
from pydantic import BaseModel

from .api_clients import (
    fetch_external_api,
    get_from_cache,
    set_in_cache,
    KAKAO_REST_API_KEY,
    OPENWEATHER_API_KEY,
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


@router.get("/api/weather-proxy")
def weather_proxy(coords: Coordinates = Depends(), type: str = "weather"):
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


@router.get("/api/cooling-centers")
def get_cooling_centers():
    cooling_centers_path = os.path.join(os.path.dirname(__file__), 'data', 'seoul_jongno_rest.json')
    with open(cooling_centers_path, 'r', encoding='utf-8') as f:
        return json.load(f)
