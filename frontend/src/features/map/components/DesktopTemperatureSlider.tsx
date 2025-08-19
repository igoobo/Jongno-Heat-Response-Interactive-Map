import React from 'react';
import { useSliderAnimation } from '../hooks/useSliderAnimation'; // New import
import { TemperatureSliderBase } from './TemperatureSliderBase'; // New import

type Props = {
  hourIndex: number;
  max: number;
  onChange: (value: number) => void;
};

export const TemperatureSlider: React.FC<Props> = ({ hourIndex, max, onChange }) => {
  // 기준 시간을 한 번만 생성하여 모든 레이블 계산에 동일하게 적용
  const baseDate = new Date();

  // 0부터 max까지의 모든 시간 인덱스 배열 생성
  const allHourIndices = Array.from({ length: max + 1 }, (_, i) => i);
  const { isPlaying, setIsPlaying } = useSliderAnimation({ hourIndex, max, onChange }); // Use the new hook

  return (
    <TemperatureSliderBase
      hourIndex={hourIndex}
      max={max}
      onChange={onChange}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
      baseDate={baseDate}
      allHourIndices={allHourIndices}
      labelInterval={3} // Pass 3 for desktop
      sliderContainerStyle={sliderContainerStyle}
      playButtonStyle={playButtonStyle}
      ticksContainerStyle={ticksContainerStyle}
      tickStyle={tickStyle}
      // Tailwind classes for common styling
      inputClassName="w-full"
      spanClassName="text-[11px]" // Original font size
    />
  );
};

// --- 스타일 정의 ---
const sliderContainerStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 20,
  left: '45%',
  transform: 'translateX(-50%)',
  width: '60%', // 너비를 조금 늘려 레이블이 겹치지 않게 함
  padding: '12px 16px',
  backgroundColor: 'rgba(255,255,255,0.9)',
  borderRadius: 8,
  boxShadow: '0 0 8px rgba(0,0,0,0.1)',
  zIndex: 100,
};

const ticksContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between', // 레이블들을 균일한 간격으로 배치
  width: '100%',
  marginTop: '8px',
  padding: '0 5px', // 좌우 패딩을 주어 슬라이더 끝과 맞춤
  boxSizing: 'border-box',
};

const tickStyle: React.CSSProperties = {
  textAlign: 'center',
  fontSize: '11px', // 폰트 크기를 살짝 줄여 공간 확보
  color: '#333',
  // 각 레이블이 독립적으로 공간을 차지하도록 설정
  flex: 1, 
  pointerEvents: 'none', 
};

const playButtonStyle: React.CSSProperties = {
  position: 'absolute',
  left: -80,
  bottom: 20,
  background: '#fff',
  border: '1px solid #ccc',
  borderRadius: 4,
  padding: '6px 12px',
  fontSize: '12px',
  cursor: 'pointer',
  boxShadow: '0 0 5px rgba(0,0,0,0.1)',
};