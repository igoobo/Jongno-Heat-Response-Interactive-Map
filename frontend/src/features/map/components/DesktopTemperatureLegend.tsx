// components/TemperatureLegend.tsx

import { TEMPERATURE_RANGES } from '../constants/temperatureRanges'; // Import shared constant
import { TemperatureLegendBase } from './TemperatureLegendBase'; // New import

export const TemperatureLegend = () => {
  return (
    <div className="absolute left-5 bottom-24 bg-white bg-opacity-90 p-2.5 rounded-md shadow-md z-50">
      <TemperatureLegendBase
        ranges={TEMPERATURE_RANGES}
        itemClassName="flex items-center mb-1.5" // Equivalent to marginBottom: 6
        squareClassName="w-4 h-4 mr-2" // Equivalent to width: 16, height: 16, marginRight: 8
        labelClassName="text-sm" // Equivalent to fontSize: 14
      />
    </div>
  );
};