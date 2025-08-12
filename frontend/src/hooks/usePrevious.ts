import { useEffect, useRef } from 'react';

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined); // 초기값 명시
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}