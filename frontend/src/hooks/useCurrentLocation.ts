// hooks/useCurrentLocation.ts
import { useState } from 'react';
import { toast } from 'react-toastify';

interface Position {
  lat: number;
  lng: number;
}


// ✅ 고유 ID 설정


export function useCurrentLocation() {
  const [position, setPosition] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);

const getLocation = (map?: any, shouldPanMap: boolean = true): Promise<Position | null> => {
    return new Promise((resolve) => {
      setError(null); // Clear previous errors
      const move = (lat: number, lng: number) => {
        if (map && shouldPanMap) {
          setTimeout(() => {
            map.panTo(new window.kakao.maps.LatLng(lat, lng));
          }, 1000);
        }
      };

      if (!navigator.geolocation) {
        const message = '브라우저가 위치 정보를 지원하지 않습니다.';
        toast.error(message, { toastId: 'location-toast' }); // Always show toast
        setError(message);
        setPosition(null); // Set position to null on error
        resolve(null); // Resolve with null on error
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos: GeolocationPosition) => {
          console.log("Geolocation success:", pos); // Log success object
          const { latitude, longitude } = pos.coords;
          const newPosition = { lat: latitude, lng: longitude };
          setPosition(newPosition);
          setError(null);
          toast.success('📍 현재 위치를 가져왔습니다!', { toastId: 'location-toast' });
          move(latitude, longitude);
          resolve(newPosition);
        },
        (err: GeolocationPositionError) => {
          console.error("Geolocation error:", err); // Log error object
          let message = '';
          switch (err.code) {
            case 1:
              message = '위치 권한이 거부되었습니다.';
              break;
            case 2:
              message = '위치 정보를 사용할 수 없습니다.';
              break;
            case 3:
              message = '위치 요청이 시간 초과되었습니다.';
              break;
            default:
              message = '알 수 없는 오류가 발생했습니다.';
          }

          setError(message);
          setPosition(null); // Set position to null on error
          toast.error(`❌ 위치 가져오기 실패: ${message}`, { toastId: 'location-toast' }); // Always show toast
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    });
  };

  return { position, error, getLocation };
}
