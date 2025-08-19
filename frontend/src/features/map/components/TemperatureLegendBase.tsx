import React from 'react';
import { getColorByTemperature } from '../../../utils/colorUtils';

interface TemperatureRange {
  temp: number;
  label: string;
}

interface TemperatureLegendBaseProps {
  ranges: TemperatureRange[];
  itemClassName?: string; // For Tailwind classes
  itemStyle?: React.CSSProperties; // For inline styles
  squareClassName?: string; // For Tailwind classes
  squareStyle?: React.CSSProperties; // For inline styles
  labelClassName?: string; // For Tailwind classes
  labelStyle?: React.CSSProperties; // For inline styles
}

export const TemperatureLegendBase: React.FC<TemperatureLegendBaseProps> = ({
  ranges,
  itemClassName,
  itemStyle,
  squareClassName,
  squareStyle,
  labelClassName,
  labelStyle,
}) => {
  return (
    <>
      {ranges.map((item, idx) => (
        <div key={idx} className={itemClassName} style={itemStyle}>
          <div className={squareClassName} style={{ ...squareStyle, backgroundColor: getColorByTemperature(item.temp) }} />
          <span className={labelClassName} style={labelStyle}>{item.label}</span>
        </div>
      ))}
    </>
  );
};