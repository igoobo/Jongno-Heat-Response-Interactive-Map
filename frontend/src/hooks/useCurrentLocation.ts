// hooks/useCurrentLocation.ts
import { useState } from 'react';
import { toast } from 'react-toastify';

interface Position {
  lat: number;
  lng: number;
}
const DEFAULT_POSITION = {
  lat: 37.57582459848882,
  lng: 126.97581958500346,
};

// ✅ 고유 ID 설정


export function useCurrentLocation() {
  const [position, setPosition] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);

const getLocation = (map?: any) => {
    const move = (lat: number, lng: number) => {
      if (map) {
      setTimeout(() => {
        map.panTo(new window.kakao.maps.LatLng(lat, lng));
      }, 1000); // ✅ 1초 후 이동
    }
    };

    if (!navigator.geolocation) {
      const message = '브라우저가 위치 정보를 지원하지 않습니다.';
      if (!toast.isActive('location-toast')) {
        toast.error(message, { toastId: 'location-toast' });
      }
      setError(message);
      setPosition(DEFAULT_POSITION);
      move(DEFAULT_POSITION.lat, DEFAULT_POSITION.lng);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition({ lat: latitude, lng: longitude });
        setError(null);
        toast.success('📍 현재 위치를 가져왔습니다!', { toastId: 'location-toast' });
        move(latitude, longitude);
      },
      (err) => {
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
        setPosition(DEFAULT_POSITION);
        toast.error(`❌ 위치 가져오기 실패: ${message}`, { toastId: 'location-toast' });
        move(DEFAULT_POSITION.lat, DEFAULT_POSITION.lng);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  return { position, error, getLocation };
}
