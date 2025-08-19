import React from 'react';
import { formatLabel } from '../../../utils/timeUtils';

interface TemperatureSliderBaseProps {
  hourIndex: number;
  max: number;
  onChange: (value: number) => void;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  baseDate: Date;
  allHourIndices: number[];
  sliderContainerStyle?: React.CSSProperties;
  playButtonStyle?: React.CSSProperties;
  ticksContainerStyle?: React.CSSProperties;
  tickStyle?: React.CSSProperties;
  // For Tailwind classes
  sliderContainerClassName?: string;
  playButtonClassName?: string;
  inputClassName?: string;
  ticksContainerClassName?: string;
  tickClassName?: string;
  spanClassName?: string;
  labelInterval?: number; // New prop for label interval
}

export const TemperatureSliderBase: React.FC<TemperatureSliderBaseProps> = ({
  hourIndex,
  max,
  onChange,
  isPlaying,
  setIsPlaying,
  baseDate,
  allHourIndices,
  sliderContainerStyle,
  playButtonStyle,
  ticksContainerStyle,
  tickStyle,
  sliderContainerClassName,
  playButtonClassName,
  inputClassName,
  ticksContainerClassName,
  tickClassName,
  spanClassName,
  labelInterval = 3, // Default to 3
}) => {
  return (
    <div className={sliderContainerClassName} style={sliderContainerStyle}>
      {/* ▶ 재생/일시정지 버튼 */}
      <button onClick={() => setIsPlaying((prev) => !prev)} className={playButtonClassName} style={playButtonStyle}>
        {isPlaying ? '⏸ 정지' : '▶ 재생'}
      </button>

      <input
        type="range"
        min={0}
        max={max}
        value={hourIndex}
        onChange={(e) => onChange(Number(e.target.value))}
        className={inputClassName}
        style={{ width: '100%' }} // This style is common
      />
      
      {/* 눈금과 시간 레이블을 표시하는 컨테이너 */}
      <div className={ticksContainerClassName} style={ticksContainerStyle}>
        {allHourIndices.map((idx) => (
          <div key={idx} className={tickClassName} style={tickStyle}>
            {/* 현재 선택된 값(hourIndex)과 일치하는 레이블은 굵게 표시 */}
             <span className={spanClassName} style={{ fontWeight: idx === hourIndex ? 'bold' : 'normal' }}>
              {/* ⭐️ 변경점: 레이블이 너무 많아지지 않도록 시간 간격으로만 텍스트 표시 */}
              {idx % labelInterval === 0 ? formatLabel(idx, baseDate) : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};