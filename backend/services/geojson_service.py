import os
import json
from fastapi import HTTPException

def get_geojson_data():
    geojson_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'jongno_wgs84.geojson')
    try:
        with open(geojson_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="jongno_wgs84.geojson not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error decoding jongno_wgs84.geojson")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

