import { useEffect } from 'react';

interface UseMapClickInfoWindowCloserProps {
  map: any;
  fixedInfoWindowRef: React.RefObject<any>;
}

export const useMapClickInfoWindowCloser = ({
  map,
  fixedInfoWindowRef,
}: UseMapClickInfoWindowCloserProps) => {
  useEffect(() => {
    if (map) {
      const handleClick = () => {
        if (fixedInfoWindowRef.current) {
          fixedInfoWindowRef.current.close();
          fixedInfoWindowRef.current = null;
        }
      };
      window.kakao.maps.event.addListener(map, 'click', handleClick);
      return () => {
        window.kakao.maps.event.removeListener(map, 'click', handleClick);
      };
    }
  }, [map, fixedInfoWindowRef]);
};
