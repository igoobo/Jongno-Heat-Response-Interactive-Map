import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface TemperatureDisplayProps {
  currentTemp: number;
  minTemp?: number;
  maxTemp?: number;
  tempDiff?: number;
  description: string;
}

const TemperatureDisplay: React.FC<TemperatureDisplayProps> = ({
  currentTemp,
  minTemp,
  maxTemp,
  tempDiff,
  description,
}) => {
  return (
    <>
      <div className="text-5xl font-bold">{currentTemp.toFixed(1)}°</div>

      <div className="text-[16px] text-muted-foreground">
        <span className="font-semibold capitalize">{description}</span>
      </div>

      <div className="text-base md:text-sm text-muted-foreground">
        최저 {minTemp?.toFixed(0)}°  최고 {maxTemp?.toFixed(0)}° 
        {tempDiff !== undefined && (
          <> {/* Use Fragment to wrap multiple elements */}
            <br className="md:hidden" /> {/* New line only on mobile */}
            <span className="ml-2 flex items-center">
              (<span style={{ fontSize: '1em', whiteSpace: 'nowrap' }}>어제 대비</span> 
              <span className={`${tempDiff > 0 ? 'text-red-500' : 'text-blue-500'} flex items-center`}>
                {tempDiff > 0 ? (
                  <ArrowUp className="w-3 h-3 inline-block ml-1" />
                ) : (
                  <ArrowDown className="w-3 h-3 inline-block ml-1" />
                )}
                {Math.abs(tempDiff).toFixed(1)}°
              </span>
              )
            </span>
          </>
        )}
      </div>
    </>
  );
};

export default TemperatureDisplay;
