import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

interface UseKakaoMapProps {
  onMapLoad?: (map: any) => void;
  onMapIdle?: (map: any) => void;
}

export function useKakaoMap({ onMapLoad, onMapIdle }: UseKakaoMapProps) {
  const mapRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);

  const loadScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.getElementById('kakao-map-script')) {
        resolve();
        return;
      }

      const KAKAO_MAP_KEY = import.meta.env.VITE_KAKAO_MAP_JS_API_KEY;
      const script = document.createElement('script');
      script.id = 'kakao-map-script';
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&autoload=false`;
      script.onload = () => resolve();
      script.onerror = () => reject('Kakao Map script load failed');
      document.head.appendChild(script);
    });
  };

  const initMap = async () => {
    if (mapRef.current) return;
    if (!window.kakao || !window.kakao.maps) return;

    return new Promise<void>((resolve, reject) => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        if (!container) {
          reject('Map container not found');
          return;
        }

        const options = {
          center: new window.kakao.maps.LatLng(37.57582459848882, 126.97581958500346),
          level: 3,
        };

        const map = new window.kakao.maps.Map(container, options);
        mapRef.current = map;

        if (onMapLoad) {
          onMapLoad(map);
        }

        if (onMapIdle) {
          window.kakao.maps.event.addListener(map, 'idle', () => onMapIdle(map));
        }

        resolve();
      });
    });
  };

  useEffect(() => {
    const loadEverything = async () => {
      try {
        setLoading(true);
        await loadScript();
        await initMap();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadEverything();
  }, []);

  return { map: mapRef.current, loading };
}
