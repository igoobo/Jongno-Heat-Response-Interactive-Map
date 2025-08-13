from typing import List
import math

def interpolate_temperatures(temps_3hr: List[float]) -> List[float]:
    if not temps_3hr or len(temps_3hr) < 2:
        return temps_3hr if temps_3hr is not None else []

    temps_1hr: List[float] = []
    for i in range(len(temps_3hr) - 1):
        start_temp = temps_3hr[i]
        end_temp = temps_3hr[i + 1]
        step = (end_temp - start_temp) / 3.0

        temps_1hr.extend([start_temp, start_temp + step, start_temp + step * 2])

    temps_1hr.append(temps_3hr[-1])
    return temps_1hr

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