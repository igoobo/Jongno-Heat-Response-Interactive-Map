from typing import Any, List
from openai import OpenAI

from ..models import Coordinates
from .weather_service import get_weather_data
from ..cache import kma_warnings_cache
from ..api_clients import FRIENDLI_TOKENS

client = OpenAI(
    api_key=FRIENDLI_TOKENS,
    base_url="https://api.friendli.ai/serverless/v1",
)

def get_chat_response(coords: Coordinates) -> Any:
    weather_data = get_weather_data(coords, type="weather")
    kma_warnings = kma_warnings_cache["data"]
    
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
    prompt = f"현재 기온은 {temp}°C이고, 날씨는 '{weather_desc}'입니다.{warnings_str} 이 정보를 바탕으로 사용자에게 유용한 정보를 제공해주세요."

    completion = client.chat.completions.create(
        model="K-intelligence/Midm-2.0-Base-Instruct",
        messages=[
            {"role": "system", 
             "content": "당신은 사용자에게 현재 날씨 정보를 기반으로 유용한 조언을 해주는 AI 비서입니다."},
            {"role": "user", 
             "content": prompt},
        ],
    )

    answer = completion.choices[0].message.content
    return {"answer": answer}
