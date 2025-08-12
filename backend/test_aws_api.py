import requests # API 요청을 보내고 받는 라이브러리
import json     # API 응답을 json형태로 가공하기 위한 라이브러리
import os
# AWS 일 통계 자료 조회 API url
api_url = "https://apihub.kma.go.kr/api/typ01/url/dly-asos"

# 요청인자로 시작시간, 종료시간, 기상요소, 지점번호, 도움말추가 여부가 있습니다.

# 1. 시작시간과 종료시간을 년월일 형태로 입력합니다.
start_time = '20220201'
end_time = '20240301'

# 2. 기상요소를 입력합니다.
# rn_day(일강수량), ta_max(일 최고기온), ta_max_dif(최고기온차(오늘-어제)), ta_max_min(일교차),
# ta_min(일 최저기온), ta_min_dif(최저기온차(오늘-어제)), ws_max(일 최대풍속), ws_ins_max(일 최대 순간풍속),
# sd_tot_max(최심적설), sd_day_max(최심 신적설)를 입력할 수 있습니다.
obs = 'ta_min'

# 3. 앞에서 확인한 지점번호를 입력합니다.
stn_id = 108

# 4. 도움말추가 여부를 입력합니다.
# 파일 내에 각 필드에 대한 도움말을 확인할 수 있습니다.
help = 1

params = {
    "authKey": 'Ek1C8O-0RwSNQvDvtAcEpw',
    "dataCd": "ASOS",
    "dateCd": "DAY",
    "startDt": "20230811",
    "endDt": "20230812",
    "stnIds": "108",  # 서울 기준
    "format": "json"
}

# API 응답을 저장할 파일 형식은 txt 파일로 저장합니다.
file_name = f"aws_day_data_{obs}_{stn_id}_{start_time}_{end_time}.txt"

# 저장된 파일이 없는 경우에만 API를 요청해 파일을 다운로드합니다.
if not os.path.exists(file_name):
    # API 요청인자와 함께 API 요청
    response = requests.get(api_url, params=params)
    
    # 잘못된 응답을 받을 경우 에러 메세지 출력
    if response.status_code != 200:
        raise requests.RequestException(
            json.loads(response.content)['result']['message']
        )
    # 짧은 에러메세지를 응답으로 받은 경우 에러 메세지 출력
    elif len(response.content) < 100:
        raise ValueError(response.content.decode('euc-kr').split('#')[2])
    else:
        # 그외의 올바른 응답에 대해서만 UTF-8 txt 파일 형태로 저장합니다.
        with open(file_name, 'wb') as f:
            f.write(response.content.decode('euc-kr').encode('utf-8'))
        print(f"{file_name} 파일 다운로드 완료")