// hooks/useDebouncedCallback.ts
import { useEffect, useRef } from 'react';

export function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestCallback = useRef(callback);

  // 항상 최신 콜백을 참조하도록 유지
  useEffect(() => {
    latestCallback.current = callback;
  }, [callback]);

  // 언마운트 시 타이머 클리어
  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  const debouncedFn = (...args: Parameters<T>) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => {
      latestCallback.current(...args);
    }, delay);
  };

  return debouncedFn;
}
