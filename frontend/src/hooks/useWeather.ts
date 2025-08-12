import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import { fetchCurrentWeather } from '../services/openWeatherService';

export const useWeather = (location: { lat: number; lng: number }) => {
  const debouncedLocation = useDebounce(location, 500);
  const [weather, setWeather] = useState<{
    temp: number;
    minTemp?: number;
    maxTemp?: number;
    description: string;
    icon: string;
    tempDiff?: number;
  } | null>(null);

  useEffect(() => {
    if (!debouncedLocation.lat || !debouncedLocation.lng) return;

    const getWeather = async () => {
      try {
        const data = await fetchCurrentWeather(debouncedLocation.lat, debouncedLocation.lng);
        setWeather({
          temp: data.main.temp,
          minTemp: data.main.temp_min,
          maxTemp: data.main.temp_max,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
        });
      } catch (error) {
        console.error('날씨 정보를 가져오는 중 오류 발생:', error);
      }
    };

    getWeather();
  }, [debouncedLocation]);

  return { weather };
};