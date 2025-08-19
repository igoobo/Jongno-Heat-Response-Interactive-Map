import { useRef, useState, useMemo } from 'react';
import { useMapStore } from '../../../stores/useMapStore'; // Import useMapStore
import { useKakaoMapScriptLoader } from './useKakaoMapScriptLoader'; // New import
import { useKakaoMapInitializer } from './useKakaoMapInitializer'; // New import

interface UseKakaoMapProps {
  onMapLoad?: (map: any) => void;
  onMapIdle?: (map: any) => void;
}

export function useKakaoMap({ onMapLoad, onMapIdle }: UseKakaoMapProps) {
  const mapRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const { scriptLoaded, scriptError } = useKakaoMapScriptLoader(); // Use the new hook
  const { setMap } = useMapStore(); // Get setMap from useMapStore

  useKakaoMapInitializer({
    mapRef,
    onMapLoad,
    onMapIdle,
    setLoading,
    scriptLoaded,
    scriptError,
    setMap, // Pass setMap to initializer
  });

  return useMemo(() => ({ map: mapRef.current, loading }), [mapRef.current, loading]);
}
