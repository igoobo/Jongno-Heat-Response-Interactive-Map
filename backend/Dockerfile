# 파이썬 3.9 버전을 기반으로 환경을 구성합니다.
FROM python:3.9-slim

# 작업 디렉터리를 /code 로 설정합니다.
WORKDIR /code

# requirements.txt 파일을 복사하고 라이브러리를 설치합니다.
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# 현재 폴더의 모든 파일을 /code 로 복사합니다.
COPY . /code

# 7860번 포트를 외부에 노출시킵니다. (Spaces의 기본 포트)
EXPOSE 7860

# 서버를 실행하는 명령어입니다.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]