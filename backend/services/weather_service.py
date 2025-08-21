from typing import List, Any
from fastapi import HTTPException

from api_clients import (
    fetch_external_api,
    get_from_cache,
    set_in_cache,
    OPENWEATHER_API_KEY,
    ExternalAPIError # Added this import
)
from models import Coordinates
from utils import interpolate_temperatures

def get_weather_data(coords: Coordinates, type: str = "weather") -> Any:
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

    try: # Added try-except block
        data = fetch_external_api(url)
    except ExternalAPIError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    
    set_in_cache(cache_key, data)
    return data

def get_polygon_temperatures_data(coords_list: List[Coordinates]) -> List[List[float]]:
    all_interpolated_temps = []
    for coords in coords_list:
        try:
            # Call the get_weather_data service function
            hourly_data = get_weather_data(coords=coords, type="forecast")
            original_temps = [item["main"]["temp"] for item in hourly_data["list"][:8]]
            interpolated_1hr = interpolate_temperatures(original_temps)
            all_interpolated_temps.append(interpolated_1hr)
        except HTTPException as e:
            # Log the error and continue to the next coordinate
            print(f"Error fetching weather data for {coords}: {e.detail}")
            all_interpolated_temps.append([])  # Append empty list to indicate failure for this coordinate
    return all_interpolated_temps
