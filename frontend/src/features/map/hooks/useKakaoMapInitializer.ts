import { useEffect } from 'react';

interface UseKakaoMapInitializerProps {
  mapRef: React.RefObject<any>;
  onMapLoad?: (map: any) => void;
  onMapIdle?: (map: any) => void;
  setLoading: (loading: boolean) => void;
  scriptLoaded: boolean;
  scriptError: string | null;
  setMap: (map: any) => void; // Add setMap prop
}

export const useKakaoMapInitializer = ({
  mapRef,
  onMapLoad,
  onMapIdle,
  setLoading,
  scriptLoaded,
  scriptError,
  setMap, // Destructure setMap
}: UseKakaoMapInitializerProps) => {
  const initMap = async () => {
    console.log('Attempting to initialize map...');
    if (mapRef.current) {
      console.log('Map already initialized, skipping.');
      return;
    }

    return new Promise<void>((resolve, reject) => {
      console.log('Waiting for window.kakao.maps to be available...');
      const checkKakaoMapsReady = setInterval(() => {
        if (window.kakao && window.kakao.maps) {
          clearInterval(checkKakaoMapsReady);
          console.log('window.kakao.maps is now available, calling window.kakao.maps.load...');
          window.kakao.maps.load(() => {
            console.log('Kakao Maps API loaded, proceeding with map initialization.');
            const container = document.getElementById('map');
            if (!container) {
              console.error('Map container not found.');
              reject('Map container not found');
              return;
            }

            const options = {
              center: new window.kakao.maps.LatLng(37.57582459848882, 126.97581958500346),
              level: 3,
            };

            const map = new window.kakao.maps.Map(container, options);
            mapRef.current = map;
            
            console.log("✅ map initialized", map); // 👈 확인
            setMap(map); // Call setMap prop

            if (onMapLoad) {
              onMapLoad(map);
            }

            if (onMapIdle) {
              window.kakao.maps.event.addListener(map, 'idle', () => onMapIdle(map));
            }

            resolve();
          });
        }
      }, 100); // Poll every 100ms
    });
  };

  useEffect(() => {
    const loadEverything = async () => {
      try {
        setLoading(true);
        if (scriptLoaded) { // Only init map if script is loaded
          console.log('Script loaded, attempting to init map.');
          await initMap();
        } else if (scriptError) { // Handle script loading error
          console.error('Script error:', scriptError);
        }
      } catch (err) {
        console.error('Error in loadEverything:', err);
      } finally {
        setLoading(false);
      }
    };

    loadEverything();
  }, [scriptLoaded, scriptError, mapRef]);
};