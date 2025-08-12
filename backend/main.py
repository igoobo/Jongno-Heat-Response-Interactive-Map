from fastapi import FastAPI, HTTPException, Body
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
import json
import requests
from typing import List

# Python equivalent of interpolateTemperatures
def interpolate_temperatures(temps_3hr: list[float]) -> list[float]:
    if not temps_3hr or len(temps_3hr) < 2:
        return temps_3hr if temps_3hr is not None else []

    temps_1hr: list[float] = []

    for i in range(len(temps_3hr) - 1):
        start_temp = temps_3hr[i]
        end_temp = temps_3hr[i + 1]
        step = (end_temp - start_temp) / 3.0

        temps_1hr.append(start_temp)
        temps_1hr.append(start_temp + step)
        temps_1hr.append(start_temp + step * 2)

    temps_1hr.append(temps_3hr[len(temps_3hr) - 1])

    return temps_1hr

from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

@app.get("/api/geojson")
def get_geojson():
    geojson_path = os.path.join(os.path.dirname(__file__), 'data', 'jongno_wgs84.geojson')
    with open(geojson_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data

@app.get("/api/kakao-proxy")
def kakao_proxy(lat: float, lng: float):
    KAKAO_REST_API_KEY = os.environ.get("VITE_KAKAO_REST_API_KEY")
    if not KAKAO_REST_API_KEY:
        raise HTTPException(status_code=500, detail="Kakao REST API key not configured in backend")

    url = f"https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x={lng}&y={lat}"
    headers = {"Authorization": f"KakaoAK {KAKAO_REST_API_KEY}"}
    print(f"Backend: Requesting Kakao Maps URL: {url}")
    response = requests.get(url, headers=headers)
    print(f"Backend: Kakao Maps Response Status: {response.status_code}")
    response.raise_for_status() # Raise an exception for HTTP errors
    return response.json()

@app.get("/api/weather-proxy")
def weather_proxy(lat: float, lng: float, type: str):
    OPENWEATHER_API_KEY = os.environ.get("VITE_OPENWEATHER_API_KEY")
    if not OPENWEATHER_API_KEY:
        raise HTTPException(status_code=500, detail="OpenWeather API key not configured in backend")

    base_url = "https://api.openweathermap.org/data/2.5/"
    if type == "weather":
        url = f"{base_url}weather?lat={lat}&lon={lng}&units=metric&lang=kr&appid={OPENWEATHER_API_KEY}"
    elif type == "forecast":
        url = f"{base_url}forecast?lat={lat}&lon={lng}&units=metric&appid={OPENWEATHER_API_KEY}"
    else:
        raise HTTPException(status_code=400, detail="Invalid weather API type. Use 'weather' or 'forecast'.")

    print(f"Backend: Requesting OpenWeatherMap URL: {url}")
    response = requests.get(url)
    print(f"Backend: OpenWeatherMap Response Status: {response.status_code}")
    response.raise_for_status()
    return response.json()

from typing import List
from fastapi import Body

@app.post("/api/polygon-temperatures")
def get_polygon_temperatures(coords: List[dict] = Body(...)):
    all_interpolated_temps = []
    for coord in coords:
        lat = coord.get("lat")
        lng = coord.get("lng")
        if lat is None or lng is None:
            raise HTTPException(status_code=400, detail="Invalid coordinate format")

        # Reuse weather_proxy logic to get hourly forecast
        hourly_data = weather_proxy(lat=lat, lng=lng, type="forecast")
        original_temps = [item["main"]["temp"] for item in hourly_data["list"][:8]]
        import requests
import time

# Python equivalent of interpolateTemperatures
def interpolate_temperatures(temps_3hr: list[float]) -> list[float]:
    if not temps_3hr or len(temps_3hr) < 2:
        return temps_3hr if temps_3hr is not None else []

    temps_1hr: list[float] = []

    for i in range(len(temps_3hr) - 1):
        start_temp = temps_3hr[i]
        end_temp = temps_3hr[i + 1]
        step = (end_temp - start_temp) / 3.0

        temps_1hr.append(start_temp)
        temps_1hr.append(start_temp + step)
        temps_1hr.append(start_temp + step * 2)

    temps_1hr.append(temps_3hr[len(temps_3hr) - 1])

    return temps_1hr

from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Simple in-memory cache for weather data
weather_cache = {}
CACHE_TTL_SECONDS = 6 * 10 * 60 # 60 minutes

@app.get("/api/geojson")
def get_geojson():
    geojson_path = os.path.join(os.path.dirname(__file__), 'data', 'jongno_wgs84.geojson')
    with open(geojson_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data

@app.get("/api/kakao-proxy")
def kakao_proxy(lat: float, lng: float):
    KAKAO_REST_API_KEY = os.environ.get("VITE_KAKAO_REST_API_KEY")
    if not KAKAO_REST_API_KEY:
        raise HTTPException(status_code=500, detail="Kakao REST API key not configured in backend")

    url = f"https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x={lng}&y={lat}"
    headers = {"Authorization": f"KakaoAK {KAKAO_REST_API_KEY}"}
    print(f"Backend: Requesting Kakao Maps URL: {url}")
    response = requests.get(url, headers=headers)
    print(f"Backend: Kakao Maps Response Status: {response.status_code}")
    response.raise_for_status() # Raise an exception for HTTP errors
    return response.json()

@app.get("/api/weather-proxy")
def weather_proxy(lat: float, lng: float, type: str):
    OPENWEATHER_API_KEY = os.environ.get("VITE_OPENWEATHER_API_KEY")
    if not OPENWEATHER_API_KEY:
        raise HTTPException(status_code=500, detail="OpenWeather API key not configured in backend")

    cache_key = f"{lat}-{lng}-{type}"
    current_time = time.time()

    if cache_key in weather_cache:
        cached_data = weather_cache[cache_key]
        if current_time - cached_data["timestamp"] < CACHE_TTL_SECONDS:
            print(f"Backend: Cache hit for {cache_key}")
            return cached_data["data"]

    # Cache miss or expired, proceed with API call
    print(f"Backend: Cache miss for {cache_key}, fetching from OpenWeatherMap...")

    base_url = "https://api.openweathermap.org/data/2.5/"
    if type == "weather":
        url = f"{base_url}weather?lat={lat}&lon={lng}&units=metric&lang=kr&appid={OPENWEATHER_API_KEY}"
    elif type == "forecast":
        url = f"{base_url}forecast?lat={lat}&lon={lng}&units=metric&appid={OPENWEATHER_API_KEY}"
    else:
        raise HTTPException(status_code=400, detail="Invalid weather API type. Use 'weather' or 'forecast'.")

    print(f"Backend: Requesting OpenWeatherMap URL: {url}")
    response = requests.get(url)
    print(f"Backend: OpenWeatherMap Response Status: {response.status_code}")
    response.raise_for_status()
    data = response.json()
    weather_cache[cache_key] = {"data": data, "timestamp": current_time}
    return data

from typing import List
from fastapi import Body

@app.post("/api/polygon-temperatures")
def get_polygon_temperatures(coords: List[dict] = Body(...)):
    all_interpolated_temps = []
    for coord in coords:
        lat = coord.get("lat")
        lng = coord.get("lng")
        if lat is None or lng is None:
            raise HTTPException(status_code=400, detail="Invalid coordinate format")

        # Reuse weather_proxy logic to get hourly forecast
        hourly_data = weather_proxy(lat=lat, lng=lng, type="forecast")
        original_temps = [item["main"]["temp"] for item in hourly_data["list"][:8]]
        interpolated_1hr = interpolate_temperatures(original_temps)
        all_interpolated_temps.append(interpolated_1hr)

    return all_interpolated_temps


# Serve frontend
app.mount("/", StaticFiles(directory="../frontend/dist", html=True), name="static")

@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    return FileResponse("../frontend/dist/index.html")

    return all_interpolated_temps


# Serve frontend
app.mount("/", StaticFiles(directory="../frontend/dist", html=True), name="static")

@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    return FileResponse("../frontend/dist/index.html")



