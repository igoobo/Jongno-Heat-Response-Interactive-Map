import { useMapLocation } from '../../../context/MapLocationContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { useWeather } from '../hooks/useWeather';
import dayjs from 'dayjs';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import WeatherIcon from './WeatherIcon';
import TemperatureDisplay from './TemperatureDisplay';

const WeatherCard = () => {
  const { location } = useMapLocation();
  const { weather } = useWeather(location);
  const isDesktop = useMediaQuery('(min-width: 768px)'); // Detect desktop/mobile

  return (
    <Card className="p-4 rounded-lg shadow-md">
      {isDesktop && ( // Conditionally render CardHeader for desktop only
        <CardHeader className="pb-2">
          <div className="text-center text-sm text-muted-foreground">
            현재 {dayjs().format('MM.DD')}
          </div>
          <CardTitle className="text-base flex items-center justify-center gap-2 mt-2">
            현재 위치 날씨
          </CardTitle>
        </CardHeader>
      )}

      <CardContent className="flex flex-col items-center space-y-2">
        {weather ? (
          <>
            <WeatherIcon iconCode={weather.icon} altText="날씨 아이콘" />

            <TemperatureDisplay
              currentTemp={weather.temp}
              minTemp={weather.minTemp}
              maxTemp={weather.maxTemp}
              tempDiff={weather.tempDiff}
              description={weather.description}
            />
          </>
        ) : (
          <p className="text-muted-foreground text-sm">날씨 정보를 불러오는 중...</p>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherCard;