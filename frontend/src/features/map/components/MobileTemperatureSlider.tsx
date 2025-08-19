import React from 'react';
import { useSliderAnimation } from '../hooks/useSliderAnimation'; // New import
import { TemperatureSliderBase } from './TemperatureSliderBase'; // New import

type Props = {
  hourIndex: number;
  max: number;
  onChange: (value: number) => void;
};

export const MobileTemperatureSlider: React.FC<Props> = ({ hourIndex, max, onChange }) => {
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
      labelInterval={6} // Pass 6 for mobile
      // Tailwind classes for mobile styling
      sliderContainerClassName="absolute top-3 right-3 z-10 w-[60vw] p-3 bg-white rounded-lg shadow-md"
      playButtonClassName="absolute right-0.5 top-22 -translate-y-1/2 bg-white border border-gray-300 rounded-md px-3 py-1 text-lg cursor-pointer shadow-sm"
      inputClassName="w-full"
      ticksContainerClassName="flex justify-between w-full mt-2 px-1 box-border"
      tickClassName="text-center text-lg text-gray-700 flex-1 pointer-events-none"
      spanClassName="text-[16px]" // Original font size
    />
  );
};