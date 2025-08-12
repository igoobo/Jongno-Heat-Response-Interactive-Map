import json
import os
from fastapi.testclient import TestClient
from unittest.mock import patch, mock_open
from ..main import app

client = TestClient(app)


def test_get_geojson():
    # Mock the file read
    mock_geojson = {"type": "FeatureCollection", "features": []}
    with patch("builtins.open", mock_open(read_data=json.dumps(mock_geojson))) as mock_file:
        response = client.get("/api/geojson")
        assert response.status_code == 200
        assert response.json() == mock_geojson
        # Construct the expected path dynamically
        expected_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'jongno_wgs84.geojson')
        mock_file.assert_called_with(expected_path, "r", encoding="utf-8")


def test_get_cooling_centers():
    # Mock the file read
    mock_centers = {"DATA": [{"name": "center1"}]}
    with patch("builtins.open", mock_open(read_data=json.dumps(mock_centers))) as mock_file:
        response = client.get("/api/cooling-centers")
        assert response.status_code == 200
        assert response.json() == mock_centers
        # Construct the expected path dynamically
        expected_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'seoul_jongno_rest.json')
        mock_file.assert_called_with(expected_path, "r", encoding="utf-8")


@patch("backend.routes.fetch_external_api")
def test_kakao_proxy(mock_fetch):
    mock_fetch.return_value = {"documents": []}
    response = client.get("/api/kakao-proxy?lat=37.5&lng=127.0")
    assert response.status_code == 200
    assert response.json() == {"documents": []}


@patch("backend.routes.fetch_external_api")
def test_weather_proxy(mock_fetch):
    mock_fetch.return_value = {"weather": "sunny"}
    response = client.get("/api/weather-proxy?lat=37.5&lng=127.0&type=weather")
    assert response.status_code == 200
    assert response.json() == {"weather": "sunny"}


@patch("backend.routes.weather_proxy")
def test_get_polygon_temperatures(mock_weather_proxy):
    mock_weather_proxy.return_value = {
        "list": [{"main": {"temp": 25}}] * 8
    }
    coords = [{"lat": 37.5, "lng": 127.0}]
    response = client.post("/api/polygon-temperatures", json=coords)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_closest_cooling_center():
    mock_centers = {
        "DATA": [
            {"lat": "37.5704", "lon": "126.9784", "facility_type1": "Type A"},
            {"lat": "37.5721", "lon": "126.9826", "facility_type1": "Type B"},
        ]
    }
    with patch("builtins.open", mock_open(read_data=json.dumps(mock_centers))) as mock_file:
        response = client.get("/api/closest-cooling-center?lat=37.571&lng=126.980")
        assert response.status_code == 200
        data = response.json()
        assert "distance_km" in data
        # Construct the expected path dynamically
        expected_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'seoul_jongno_rest.json')
        mock_file.assert_called_with(expected_path, "r", encoding="utf-8")


@patch("backend.routes.fetch_external_api")
def test_get_kma_temperature_extremes(mock_fetch):
    mock_fetch.return_value = {"response": {"body": {"items": {"item": []}}}}
    response = client.get("/api/kma-temperature-extremes?base_date=20241010&base_time=0500")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_kma_weather_warnings():
    with patch.dict("backend.routes.kma_warnings_cache", {"data": ["warning1"]}, clear=True):
        response = client.get("/api/kma-weather-warnings")
        assert response.status_code == 200
        assert response.json() == ["warning1"]
