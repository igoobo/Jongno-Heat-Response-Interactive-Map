// utils/timeUtils.ts

// 숫자를 두 자리 문자열로 만들어주는 도우미 함수 (예: 7 -> "07")
export const padZero = (num: number): string => num.toString().padStart(2, '0');

// 시간에 따라 표시될 레이블을 생성하는 함수
export const formatLabel = (hourIndex: number, baseDate: Date): string => {
  // hourIndex * 3 -> hourIndex * 1 (1시간 간격으로 계산)
  const futureDate = new Date(baseDate.getTime() + hourIndex * 1 * 60 * 60 * 1000);

  const month = padZero(futureDate.getMonth() + 1);
  const day = padZero(futureDate.getDate());
  const hours = padZero(futureDate.getHours());
  
  const timeFormat = `${hours}:00`;

  // 첫 번째 인덱스는 항상 날짜를 표시하여 기준점을 알려줍니다.
  if (hourIndex === 0) {
    return `${month}/${day} ${timeFormat}`;
  }
  // 이전 시간의 날짜를 가져옵니다.
  const previousDate = new Date(baseDate.getTime() + (hourIndex - 3) * 60 * 60 * 1000);

  // 이전 시간과 현재 시간의 날짜(day)가 다를 경우 (즉, 다음 날로 넘어간 첫 시간)
  // month/day를 함께 표시합니다.
  if (futureDate.getDate() !== previousDate.getDate()) {
    return `${month}/${day} ${timeFormat}`;
  }
  
  return timeFormat;
};
