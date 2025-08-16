from typing import Any, List
from openai import OpenAI
from datetime import datetime # Import datetime

from ..models import Coordinates
from .weather_service import get_weather_data
from ..cache import kma_warnings_cache
from ..api_clients import FRIENDLI_TOKENS
from .kma_service import get_kma_temperature_extremes_data # Import KMA service

client = OpenAI(
    api_key=FRIENDLI_TOKENS,
    base_url="https://api.friendli.ai/serverless/v1",
)

def get_notification_response(coords: Coordinates) -> Any:
    weather_data = get_weather_data(coords, type="weather")
    kma_warnings = kma_warnings_cache["data"]
    
    # Get current date and time for KMA API
    now = datetime.now()
    base_date = now.strftime("%Y%m%d")
    # For simplicity, let's use the current hour and round down to the nearest 3-hour mark for base_time
    # This might need more robust logic for production, but for a quick integration, it's fine.
    # A more accurate approach would be to find the latest available base_time.
    current_hour = now.hour
    if current_hour < 2: base_time = "2300" # Previous day's last
    elif current_hour < 5: base_time = "0200"
    elif current_hour < 8: base_time = "0500"
    elif current_hour < 11: base_time = "0800"
    else: base_time = "1100"

    # Fetch KMA temperature extremes (using hardcoded nx, ny for Gwanghwamun as per routes.py)
    highest_temp_str = ""
    try:
        kma_temps = get_kma_temperature_extremes_data(base_date, base_time, nx=60, ny=127)
        tmx_items = [item for item in kma_temps if item.get("category") == "TMX"]
        if tmx_items:
            # Assuming the first TMX item is the relevant one
            highest_temp = tmx_items[0].get("fcstValue")
            if highest_temp:
                highest_temp_str = f" 오늘 최고 기온은 {highest_temp}°C로 예상됩니다."
    except Exception as e:
        print(f"Failed to fetch KMA temperature extremes: {e}")
        # Continue without highest temperature if fetch fails

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
    prompt = f"현재 기온은 {temp}°C이고, 날씨는 '{weather_desc}'입니다.{warnings_str}{highest_temp_str} 이 정보를 바탕으로 사용자에게 유용한 정보를 제공해주세요."

    completion = client.chat.completions.create(
        model="K-intelligence/Midm-2.0-Base-Instruct",
        messages=[
            {"role": "system", 
             "content": "당신은 사용자에게서 입력 받은 데이터를 기반으로 답해주는 AI 알리미입니다. \
                        날씨에 대한 요약과 그에 따른 온열 질환 예방을 위해 필요한 조치를 설명하는 자료를 만들고 \
                        온열 질환이 발생하지 않는 날씨라면 필요 조치를 생략하고 그 이유를 표현해주세요.    \
                        사용자에게 간결하고 명확하게 30자 이내로 설명해주세요. \
                        강조는 사용하지 말아야하며, 대신에 이모티콘은 사용해도 됩니다."},
            {"role": "user", 
             "content": prompt},
        ],
    )

    answer = completion.choices[0].message.content
    return {"answer": answer}



def get_heat_stages_response(coords: Coordinates) -> Any:
    weather_data = get_weather_data(coords, type="weather")
    kma_warnings = kma_warnings_cache["data"]
    
    # Get current date and time for KMA API
    now = datetime.now()
    base_date = now.strftime("%Y%m%d")
    # For simplicity, let's use the current hour and round down to the nearest 3-hour mark for base_time
    # This might need more robust logic for production, but for a quick integration, it's fine.
    # A more accurate approach would be to find the latest available base_time.
    current_hour = now.hour
    if current_hour < 2: base_time = "2300" # Previous day's last
    elif current_hour < 5: base_time = "0200"
    elif current_hour < 8: base_time = "0500"
    elif current_hour < 11: base_time = "0800"
    else: base_time = "1100"

    # Fetch KMA temperature extremes (using hardcoded nx, ny for Gwanghwamun as per routes.py)
    highest_temp = 0
    highest_temp_str = ""
    try:
        kma_temps = get_kma_temperature_extremes_data(base_date, base_time, nx=60, ny=127)
        tmx_items = [item for item in kma_temps if item.get("category") == "TMX"]
        if tmx_items:
            # Assuming the first TMX item is the relevant one
            highest_temp = tmx_items[0].get("fcstValue")
            if highest_temp:
                highest_temp_str = f" 오늘 최고 기온은 {highest_temp}°C로 예상됩니다."
    except Exception as e:
        print(f"Failed to fetch KMA temperature extremes: {e}")
        # Continue without highest temperature if fetch fails

    # Extract relevant weather information
    temp = weather_data.get("main", {}).get("temp")
    weather_desc = weather_data.get("weather", [{}])[0].get("description")

    # Prepare KMA warnings string
    warnings_str = ""
    if kma_warnings:
        warnings_list = [w.get("WRN") + " " + w.get("LVL") for w in kma_warnings[:1] if w.get("WRN") and w.get("LVL")]
        if warnings_list:
            warnings_str = f" 현재 기상 특보는 다음과 같습니다: {', '.join(warnings_list)}."

    # Prepare the prompt for the language model
    prompt = f"현재 기온은 {temp}°C이고, 날씨는 '{weather_desc}'입니다.{warnings_str}{highest_temp_str} 이 정보를 바탕으로 온열질환 발생 가능성 점수를 제공해주세요."
    
    completion = client.chat.completions.create(
        model="K-intelligence/Midm-2.0-Base-Instruct",
        messages=[
            {"role": "system", 
             "content": f"""
                        당신은 온열질환 예방 전문가입니다. 
                        사용자가 제공하는 현재 기온, 날씨 요약, 기상 특보 여부와 종류, 최고 기온(℃)을 기반으로
                        0~100 사이의 '온열질환 발생 가능 점수'를 산출하세요. 
                        [점수 산정 원칙]
                        1. 동일한 입력에는 항상 동일한 결과를 제공합니다. 오차 범위는 ±3을 넘지 않습니다.
                        2. 점수가 높을수록 위험도가 높음을 의미합니다.
                        3. 기온·날씨·특보·최고기온 간 상관관계를 고려하되, **보수적으로 측정**합니다.
                        4. 점수 산식(내부적으로만 사용):
                        - 기본점수: {temp} × 1.2 (현재 기온 x 1.2)
                        - 최고기온 ={highest_temp}이 33℃ 이상이면 +15점, 35℃ 이상이면 +25점
                        - {weather_desc}에서 날씨가 '맑음'이고 무풍·강한 일사 예상 시 +5점
                        - {warnings_list}에서 '폭염주의' 시 +15점, '폭염경보' 시 +25점
                        - {weather_desc}에서 흐림·비·구름많음일 경우 -5점 (단, 기온이 매우 높은 경우 제외)
                        - 점수는 최소 0, 최대 100으로 제한
                        문장의 마지막에는 무조건 다음 형식을 지켜주세요.
                        """},
            {"role": "user", 
             "content": prompt},
        ],
    )
    reasoning = completion.choices[0].message.content

    completion = client.chat.completions.create(
        model="K-intelligence/Midm-2.0-Base-Instruct",
        messages=[
            {"role": "system", 
             "content": f"""
                        사용자에게 입력받은 내용을 바탕으로 온열질환 발생 가능 점수가 몇 점인지 제공하세요.
                        오직 출력은 정수 숫자 형태여야 합니다.
                        """},
            {"role": "user", 
             "content": reasoning},
        ],
    )
    answer = completion.choices[0].message.content
    return {"reasoning": reasoning,
            "answer" : answer}