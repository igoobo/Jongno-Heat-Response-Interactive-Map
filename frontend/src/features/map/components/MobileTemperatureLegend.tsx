

import { getColorByTemperature } from '../../../utils/colorUtils';

export const MobileTemperatureLegend = () => {
  const tempRanges = [
    { temp: 25, label: '≤ 25°C' },
    { temp: 28, label: '≤ 28°C' },
    { temp: 30, label: '≤ 30°C' },
    { temp: 33, label: '≤ 33°C' },
    { temp: 35, label: '≤ 35°C' },
    { temp: 38, label: '> 35°C' },
  ];

  return (
    <div className="absolute top-23 left-4 z-10 p-2 bg-white/60 rounded-lg shadow-md h-14vh w-20vw">
      {tempRanges.map((item, idx) => (
        <div key={idx} className="flex items-center mb-1">
          <div className="w-3 h-3 mr-2" style={{ backgroundColor: getColorByTemperature(item.temp) }} />
          <span className="text-[16px]">{item.label}</span>
        </div>
      ))}
    </div>
  );
};