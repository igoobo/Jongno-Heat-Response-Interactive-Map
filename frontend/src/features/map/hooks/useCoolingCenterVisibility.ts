import { useEffect } from 'react';
import type { LayerStates } from '../../../context/MapLayerContext';

interface UseCoolingCenterVisibilityProps {
  map: any;
  layerStates: LayerStates;
  markersRef: React.RefObject<any[]>;
  openInfoWindowRef: React.RefObject<any>;
  fixedInfoWindowRef: React.RefObject<any>;
}

export const useCoolingCenterVisibility = ({
  map,
  layerStates,
  markersRef,
  openInfoWindowRef,
  fixedInfoWindowRef,
}: UseCoolingCenterVisibilityProps) => {
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
  }, [layerStates.coolingCenter, map, markersRef, openInfoWindowRef, fixedInfoWindowRef]);
};
