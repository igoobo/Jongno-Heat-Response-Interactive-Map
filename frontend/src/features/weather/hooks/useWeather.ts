import { useState, useEffect } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';
import { fetchCurrentWeather } from '../services/openWeatherService';
import { latLngToNxNy } from '../../../utils/kmaCoords'; // Import KMA coordinate converter
import { fetchKmaTemperatureExtremes } from '../services/kmaWeatherService'; // Import KMA weather service
import dayjs from 'dayjs'; // Import dayjs for date formatting

export const useWeather = (location: { lat: number; lng: number }) => {
  const debouncedLocation = useDebounce(location, 500);
  const [weather, setWeather] = useState<{
    temp: number;
    minTemp?: number;
    maxTemp?: number;
    description: string;
    icon: string;
    tempDiff?: number; // Added tempDiff to type
  } | null>(null);

  useEffect(() => {
    if (!debouncedLocation.lat || !debouncedLocation.lng) return;

    const getWeather = async () => {
      try {
        const openWeatherData = await fetchCurrentWeather(debouncedLocation.lat, debouncedLocation.lng);
        
        const { nx, ny } = latLngToNxNy(debouncedLocation.lat, debouncedLocation.lng);

        // Fetch today's KMA temperature extremes
        const getKmaBaseTime = () => {
          const now = dayjs();
          const currentHour = now.hour();
          const currentMinute = now.minute();

          const times = [2, 5, 8, 11]; // KMA update hours

          let selectedHour = 0;
          let selectedDate = dayjs(); // Default to today

          // Find the latest base_time that has passed
          for (let i = times.length - 1; i >= 0; i--) {
            const updateHour = times[i];
            if (currentHour > updateHour || (currentHour === updateHour && currentMinute >= 0)) {
              selectedHour = updateHour;
              break;
            }
          }

          // If no update time has passed today, use the last update from yesterday
          if (selectedHour === 0 && currentHour < times[0]) {
            selectedDate = dayjs().subtract(1, 'day');
            selectedHour = times[times.length - 1]; // Last update hour of yesterday
          }
          
          return {
            date: selectedDate.format('YYYYMMDD'),
            time: String(selectedHour).padStart(2, '0') + '00'
          };
        };

        const { date: today_base_date_dynamic, time: today_base_time_dynamic } = getKmaBaseTime();
        const todayKmaData = await fetchKmaTemperatureExtremes(nx, ny, today_base_date_dynamic, today_base_time_dynamic);

        let todayMinTempKma: number | undefined;
        let todayMaxTempKma: number | undefined;

        todayKmaData.forEach((item: any) => {
          if (item.category === 'TMX') {
            todayMaxTempKma = parseFloat(item.fcstValue);
          } else if (item.category === 'TMN') {
            todayMinTempKma = parseFloat(item.fcstValue);
          }
        });

        // Fetch yesterday's KMA temperature extremes
        const yesterday_base_date = dayjs().subtract(1, 'day').format('YYYYMMDD');
        const yesterday_base_time = '1100'; 
        const yesterdayKmaData = await fetchKmaTemperatureExtremes(nx, ny, yesterday_base_date, yesterday_base_time);

        let yesterdayMaxTempKma: number | undefined;

        yesterdayKmaData.forEach((item: any) => {
          if (item.category === 'TMX') {
            yesterdayMaxTempKma = parseFloat(item.fcstValue);
          }
        });

        let tempDifference: number | undefined;
        if (todayMaxTempKma !== undefined && yesterdayMaxTempKma !== undefined) {
          tempDifference = todayMaxTempKma - yesterdayMaxTempKma;
        }

        setWeather({
          temp: openWeatherData.main.temp,
          minTemp: todayMinTempKma || openWeatherData.main.temp_min,
          maxTemp: todayMaxTempKma || openWeatherData.main.temp_max,
          description: openWeatherData.weather[0].description,
          icon: openWeatherData.weather[0].icon,
          tempDiff: tempDifference, // Add temperature difference
        });
      } catch (error) {
        console.error('날씨 정보를 가져오는 중 오류 발생:', error);
      }
    };

    getWeather();
  }, [debouncedLocation]);

  return { weather };
};