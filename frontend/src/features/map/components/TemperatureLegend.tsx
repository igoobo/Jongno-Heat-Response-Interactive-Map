// components/TemperatureLegend.tsx

import { getColorByTemperature } from '../../../utils/colorUtils';

export const TemperatureLegend = () => {
  const temperatureRanges = [
    { temp: 25, label: '25°C' },
    { temp: 28, label: '28°C' },
    { temp: 30, label: '30°C' },
    { temp: 33, label: '33°C' },
    { temp: 35, label: '35°C' },
    { temp: 38, label: '38°C+' },
  ];

  return (
    <div style={legendStyle}>
      {temperatureRanges.map((item, idx) => (
        <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
          <div style={{
            width: 16, height: 16, backgroundColor: getColorByTemperature(item.temp), marginRight: 8,
          }} />
          <span style={{ fontSize: 14 }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

const legendStyle: React.CSSProperties = {
  position: 'absolute',
  left: 20,
  bottom: 100,
  backgroundColor: 'rgba(255,255,255,0.9)',
  padding: '10px 12px',
  borderRadius: 6,
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  zIndex: 100,
};