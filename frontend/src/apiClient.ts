// src/apiClient.ts

// .env 파일에 저장했던 API 기본 주소를 불러옵니다.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * API 서버에 요청을 보내는 타입스크립트 헬퍼 함수
 * @param endpoint - '/api/cooling-centers'와 같은 API 경로
 * @param options - fetch 함수에 전달할 추가 옵션 (method, body 등)
 * @returns API 응답의 JSON 데이터
 */
export const apiClient = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  // 기본 주소와 엔드포인트를 합쳐 전체 URL을 만듭니다.
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  // 응답이 성공적이지 않으면 에러를 던집니다.
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // JSON 데이터를 파싱하여 반환합니다.
  // <T>는 이 함수를 호출할 때 기대하는 데이터의 타입을 지정할 수 있게 해줍니다.
  return response.json() as Promise<T>;
};