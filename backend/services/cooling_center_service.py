import os
import json
from typing import Any, Optional
from fastapi import HTTPException

from ..utils import haversine

def get_cooling_centers_data() -> Any:
    cooling_centers_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'seoul_jongno_rest.json')
    try:
        with open(cooling_centers_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="seoul_jongno_rest.json not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error decoding seoul_jongno_rest.json")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def get_closest_cooling_center_data(lat: float, lng: float, facility_type1: Optional[str] = None) -> Any:
    cooling_centers_data = get_cooling_centers_data()
        
    filtered_centers = []
    for center in cooling_centers_data.get("DATA", []):
        if facility_type1 is None or center.get("facility_type1") == facility_type1:
            filtered_centers.append(center)

    closest_center = None
    min_distance = float('inf')

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
