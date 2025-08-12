import { useEffect } from 'react';
import { useCoolingCenters } from '../../hooks/useCoolingCenters';

interface MapCoolingCenterLayerProps {
  map: any;
  layerStates: any;
  onLoad: () => void;
}

export const MapCoolingCenterLayer: React.FC<MapCoolingCenterLayerProps> = ({
  map,
  layerStates,
  onLoad,
}) => {
  const { markersRef, openInfoWindowRef, fixedInfoWindowRef } = useCoolingCenters(map, layerStates, onLoad);

  useEffect(() => {
    if (!map || markersRef.current.length === 0) return;

    if (!layerStates.coolingCenter) {
      if (openInfoWindowRef.current) {
        openInfoWindowRef.current.close();
        openInfoWindowRef.current = null;
      }
      if (fixedInfoWindowRef.current) {
        fixedInfoWindowRef.current.close();
        fixedInfoWindowRef.current = null;
      }
    }

    markersRef.current.forEach((marker: any) => {
      marker.setMap(layerStates.coolingCenter ? map : null);
    });
  }, [layerStates.coolingCenter, map]);

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
  }, [map]);

  return null;
};