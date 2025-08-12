// src/services/openWeatherService.ts

// Cache structure: Map<key, { data: any, timestamp: number }>
const cache = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

async function fetchWithCache(url: string, type: 'weather' | 'forecast', lat: number, lng: number) {
  const key = `${type}-${lat}-${lng}`;
  const cached = cache.get(key);
  const now = Date.now();

  if (cached && (now - cached.timestamp < CACHE_TTL_MS)) {
    console.log(`Cache hit for ${key}`);
    return cached.data;
  }

  console.log(`Cache miss for ${key}, fetching...`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${type} data from proxy`);

  const data = await res.json();
  cache.set(key, { data, timestamp: now });
  return data;
}

export async function fetchCurrentWeather(lat: number, lng: number) {
  const url = `/api/weather-proxy?lat=${lat}&lng=${lng}&type=weather`;
  return fetchWithCache(url, 'weather', lat, lng);
}

export async function fetchHourlyForecast(lat: number, lng: number) {
  const url = `/api/weather-proxy?lat=${lat}&lng=${lng}&type=forecast`;
  return fetchWithCache(url, 'forecast', lat, lng);
}
