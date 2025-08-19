import { useState, useEffect } from 'react';

interface UseSliderAnimationProps {
  hourIndex: number;
  max: number;
  onChange: (value: number) => void;
}

export const useSliderAnimation = ({ hourIndex, max, onChange }: UseSliderAnimationProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (hourIndex >= max) {
        onChange(0); // Loop: back to start
      } else {
        onChange(hourIndex + 1);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [isPlaying, hourIndex, max, onChange]);

  return { isPlaying, setIsPlaying };
};
