import requests

api_url = 'https://apihub.kma.go.kr/openapi/service/rest/WeatherDalyInfoService/getWthrDalyInfo'

params = {
    'authKey': 'Ek1C8O-0RwSNQvDvtAcEpw',
    'dataCd': 'ASOS',
    'dateCd': 'DAY',
    'startDt': '20230801',
    'endDt': '20230807',
    'stnIds': '112',     # 인천
    'format': 'json'
}

res = requests.get(api_url, params=params)
res.raise_for_status()
data = res.json()

# 응답에서 일 최고/최저기온과 발생시각 접근 (키 이름은 계정/포맷에 따라 소문자 변환될 수 있음)
items = data['response']['body']['items']['item']
for it in items:
    # 예시 키: 'taMax', 'taMin', 'taMaxTm', 'taMinTm' 또는 'TA_MAX', 'TA_MIN', 'TA_MAX_TM', 'TA_MIN_TM'
    print(it.get('tm'), it.get('taMax') or it.get('TA_MAX'),
          it.get('taMaxTm') or it.get('TA_MAX_TM'))
