import { useMapLocation } from '../../../context/MapLocationContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { CloudSun, ArrowUp, ArrowDown } from 'lucide-react';
import { useWeather } from '../hooks/useWeather';
import dayjs from 'dayjs';
import { useMediaQuery } from '../../../hooks/useMediaQuery'; // New import

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
            <CloudSun className="w-5 h-5" />
            현재 위치 날씨
          </CardTitle>
        </CardHeader>
      )}

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

            <div className="text-xs md:text-sm text-muted-foreground">
              최저 {weather.minTemp?.toFixed(0)}° · 최고 {weather.maxTemp?.toFixed(0)}° 
              {weather.tempDiff !== undefined && (
                <> {/* Use Fragment to wrap multiple elements */}
                  <br className="md:hidden" /> {/* New line only on mobile */}
                  <span className="ml-2 flex items-center">
                    (<span style={{ fontSize: '1em', whiteSpace: 'nowrap' }}>어제 대비</span> 
                    <span className={`${weather.tempDiff > 0 ? 'text-red-500' : 'text-blue-500'} flex items-center`}>
                      {weather.tempDiff > 0 ? (
                        <ArrowUp className="w-3 h-3 inline-block ml-1" />
                      ) : (
                        <ArrowDown className="w-3 h-3 inline-block ml-1" />
                      )}
                      {Math.abs(weather.tempDiff).toFixed(1)}°
                    </span>
                    )
                  </span>
                </>
              )}
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