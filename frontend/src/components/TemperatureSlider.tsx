// components/TemperatureSlider.tsx
import React from 'react';

type Props = {
  hourIndex: number;
  max: number;
  onChange: (value: number) => void;
};

export const TemperatureSlider: React.FC<Props> = ({ hourIndex, max, onChange }) => {
  return (
    <div style={sliderContainerStyle}>
      <input
        type="range"
        min={0}
        max={max}
        value={hourIndex}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%' }}
      />
      <div style={{ textAlign: 'center', marginTop: 6, fontSize: 14 }}>
        +{hourIndex * 3}h
      </div>
    </div>
  );
};

const sliderContainerStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 20,
  left: '50%',
  transform: 'translateX(-50%)',
  width: '60%',
  padding: '12px 16px',
  backgroundColor: 'rgba(255,255,255,0.9)',
  borderRadius: 8,
  boxShadow: '0 0 8px rgba(0,0,0,0.1)',
  zIndex: 100,
};
