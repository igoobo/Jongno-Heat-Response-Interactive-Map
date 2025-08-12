// 파일: /utils/interpolationUtils.ts (예시)

/**
 * 3시간 간격의 온도 배열을 선형 보간하여 1시간 간격 배열로 변환합니다.
 * @param temps3hr - 3시간 간격의 온도 데이터 배열 (예: [10, 13, 13, 10, ...])
 * @returns 1시간 간격으로 보간된 온도 데이터 배열
 */
export const interpolateTemperatures = (temps3hr: number[]): number[] => {
  if (!temps3hr || temps3hr.length < 2) {
    return temps3hr || [];
  }

  const temps1hr: number[] = [];

  // 마지막 요소를 제외하고 각 3시간의 간격을 보간합니다.
  for (let i = 0; i < temps3hr.length - 1; i++) {
    const startTemp = temps3hr[i];      // 3시간 간격의 시작 온도 (예: 00시 온도)
    const endTemp = temps3hr[i + 1];    // 3시간 간격의 종료 온도 (예: 03시 온도)
    const step = (endTemp - startTemp) / 3.0; // 1시간당 온도 변화량

    // 현재 시간(i*3)의 온도와, 이후 2시간(i*3+1, i*3+2)의 온도를 추가합니다.
    temps1hr.push(startTemp);
    temps1hr.push(startTemp + step);
    temps1hr.push(startTemp + step * 2);
  }

  // 배열의 가장 마지막 시간대 온도를 추가합니다.
  temps1hr.push(temps3hr[temps3hr.length - 1]);

  return temps1hr;
};