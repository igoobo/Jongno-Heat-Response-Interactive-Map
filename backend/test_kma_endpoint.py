import requests
import json

def test_kma_endpoint():
    print("--- Testing /api/kma-weather-warnings endpoint ---")
    try:
        response = requests.get("http://127.0.0.1:8000/api/kma-weather-warnings")
        response.raise_for_status()
        print(json.dumps(response.json(), indent=2, ensure_ascii=False))
    except requests.exceptions.RequestException as e:
        print(f"Error calling endpoint: {e}")
    print("----------------------------------------------------")

if __name__ == "__main__":
    test_kma_endpoint()
