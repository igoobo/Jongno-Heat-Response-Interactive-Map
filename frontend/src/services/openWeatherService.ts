// src/services/openWeatherService.ts

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export async function fetchCurrentWeather(lat: number, lng: number) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&lang=kr&appid=${OPENWEATHER_API_KEY}`
  );
  if (!res.ok) throw new Error('Failed to fetch current weather');
  return res.json();
}

export async function fetchHourlyForecast(lat: number, lng: number) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&units=metric&appid=${OPENWEATHER_API_KEY}`
  );
  if (!res.ok) throw new Error('Failed to fetch hourly forecast');
  return res.json();
}
