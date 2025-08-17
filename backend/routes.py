import json
import os
from typing import List

from fastapi import APIRouter, Body, Depends

from .models import Coordinates
from .services.weather_service import get_weather_data, get_polygon_temperatures_data
from .services import geojson_service, kakao_service, cooling_center_service, kma_service, chat_service


router = APIRouter()


@router.get("/api/geojson")
def get_geojson():
    return geojson_service.get_geojson_data()


@router.get("/api/kakao-proxy")
def kakao_proxy(coords: Coordinates = Depends()):
    return kakao_service.get_kakao_data(coords)


@router.get("/api/weather-proxy")
def weather_proxy(coords: Coordinates = Depends(), type: str = "weather"):
    return get_weather_data(coords, type)


@router.post("/api/polygon-temperatures")
def get_polygon_temperatures(coords_list: List[Coordinates] = Body(...)):
    return get_polygon_temperatures_data(coords_list)


@router.get("/api/cooling-centers")
def get_cooling_centers():
    return cooling_center_service.get_cooling_centers_data()


@router.get("/api/closest-cooling-center")
def get_closest_cooling_center(lat: float, lng: float, facility_type1: str = None):
    return cooling_center_service.get_closest_cooling_center_data(lat, lng, facility_type1)


@router.get("/api/kma-temperature-extremes")
def get_kma_temperature_extremes(base_date: str, base_time: str, nx: int = 60, ny: int = 127):
    return kma_service.get_kma_temperature_extremes_data(base_date, base_time, nx, ny)




@router.get("/api/kma-weather-warnings")
def get_kma_weather_warnings():
    return kma_service.get_cached_kma_warnings_data()


@router.get("/api/notification")
def chat():
    # Coordinates for the center of Gwanghwmun
    coords = Coordinates(lat=37.5760, lng=126.9769)
    return chat_service.get_notification_response(coords)

from .cache import cache # Import cache

# ... (other imports)

@router.get("/api/heat-stages")
def get_heat_stages(): # Renamed function for clarity
    CACHE_KEY = "heat_stages_data"
    CACHE_TTL = 300 # Cache for 5 minutes (300 seconds)

    cached_data = cache.get(CACHE_KEY)
    if cached_data:
        return cached_data

    # Coordinates for the center of Gwanghwmun
    coords = Coordinates(lat=37.5760, lng=126.9769)
    response_data = chat_service.get_heat_stages_response(coords)
    cache.set(CACHE_KEY, response_data, CACHE_TTL)
    return response_data