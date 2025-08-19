

import { TEMPERATURE_RANGES } from '../constants/temperatureRanges'; // Import shared constant
import { TemperatureLegendBase } from './TemperatureLegendBase'; // New import

export const MobileTemperatureLegend = () => {
  // Adjust labels for mobile view
  const mobileTempRanges = TEMPERATURE_RANGES.map((range, idx) => {
    if (idx === TEMPERATURE_RANGES.length - 1) {
      return { ...range, label: `> ${range.temp - 3}°C` }; // Adjust for last item
    }
    return { ...range, label: `≤ ${range.temp}°C` };
  });

  return (
    <div className="absolute top-23 left-4 z-10 p-2 bg-white/60 rounded-lg shadow-md h-14vh w-20vw">
      <TemperatureLegendBase
        ranges={mobileTempRanges}
        itemClassName="flex items-center mb-1"
        squareClassName="w-3 h-3 mr-2"
        labelClassName="text-[16px]"
      />
    </div>
  );
};