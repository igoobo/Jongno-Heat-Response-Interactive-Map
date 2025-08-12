import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

type Location = {
  lat: number;
  lng: number;
};

type ForecastItem = {
  dt: number;
  main: {
    temp: number;
    humidity: number;
  };
};

export function useHourlyForecast(location: Location) {
  const [data, setData] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState(true);
  const debouncedLocation = useDebounce(location, 300);

  useEffect(() => {
    const fetchForecast = async () => {
      
      try {
        setLoading(true);
        const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${debouncedLocation.lat}&lon=${debouncedLocation.lng}&units=metric&appid=${apiKey}`;
        
        const start = Date.now();
        
        const res = await fetch(url);
        const result = await res.json();

        // list: [{ dt, main: { temp, humidity }, ... }]
        if (result?.list) {
          setData(result.list.slice(0, 8)); // 3시간 간격 x 4 = 24시간치
        }

        // 최소 로딩 시간 보장
        const elapsed = Date.now() - start;
        const MIN_LOADING_MS = 550;
        if (elapsed < MIN_LOADING_MS) {
          await new Promise((res) => setTimeout(res, MIN_LOADING_MS - elapsed));
        }
      } catch (err) {
        console.error("날씨 데이터 로딩 실패", err);
      } finally {
        setLoading(false);
      }
    };

    if (debouncedLocation.lat && debouncedLocation.lng) {
      fetchForecast();
    }
  }, [debouncedLocation]);
  
  return { data, loading };
}
