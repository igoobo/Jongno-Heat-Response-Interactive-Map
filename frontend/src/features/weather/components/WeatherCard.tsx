import { useMapLocation } from '../../../context/MapLocationContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { CloudSun } from 'lucide-react';
import { useWeather } from '../hooks/useWeather';
import dayjs from 'dayjs';

const WeatherCard = () => {
  const { location } = useMapLocation();
  const { weather } = useWeather(location);

  return (
    <Card className="p-4 rounded-lg shadow-md">
      <CardHeader className="pb-2">
        <div className="text-center text-sm text-muted-foreground">
          현재 {dayjs().format('MM.DD')}
        </div>
        <CardTitle className="text-base flex items-center justify-center gap-2 mt-2">
          <CloudSun className="w-5 h-5" />
          현재 위치 날씨
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center space-y-2">
        {weather ? (
          <>
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute w-20 h-20 rounded-full bg-blue-400 opacity-78 blur-xl" />
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
                alt="날씨 아이콘"
                className="w-20 h-20 relative z-10"
              />
            </div>

            <div className="text-5xl font-bold">{weather.temp.toFixed(1)}°</div>

            <div className="text-sm text-muted-foreground">
              <span className="font-semibold capitalize">{weather.description}</span>
            </div>

            <div className="text-xs text-muted-foreground">
              최저 {weather.minTemp?.toFixed(0)}° · 최고 {weather.maxTemp?.toFixed(0)}°
            </div>
          </>
        ) : (
          <p className="text-muted-foreground text-sm">날씨 정보를 불러오는 중...</p>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
