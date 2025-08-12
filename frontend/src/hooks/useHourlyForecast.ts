import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { fetchHourlyForecast } from "../services/openWeatherService";

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
    const getForecast = async () => {
      try {
        setLoading(true);
        const start = Date.now();
        
        const result = await fetchHourlyForecast(debouncedLocation.lat, debouncedLocation.lng);

        if (result?.list) {
          setData(result.list.slice(0, 8));
        }

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
      getForecast();
    }
  }, [debouncedLocation]);
  
  return { data, loading };
}
