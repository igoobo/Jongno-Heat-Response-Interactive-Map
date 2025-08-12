// src/services/weatherService.ts
export async function fetchCurrentWeather(lat: number, lng: number) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&lang=kr&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
  );
  console.log("weather1")
  if (!res.ok) throw new Error('현재 날씨 조회 실패');
  return res.json();
}

export async function fetchHourlyForecast(lat: number, lng: number) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
  );
  console.log("weather2")
  if (!res.ok) throw new Error('시간별 예보 조회 실패');
  return res.json();
}
