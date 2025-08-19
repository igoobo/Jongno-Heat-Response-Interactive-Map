import { useCoolingCenters } from '../../hooks/useCoolingCenters';
import { useCoolingCenterVisibility } from '../../hooks/useCoolingCenterVisibility'; // New import
import { useMapClickInfoWindowCloser } from '../../hooks/useMapClickInfoWindowCloser'; // New import

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

  useCoolingCenterVisibility({
    map,
    layerStates,
    markersRef,
    openInfoWindowRef,
    fixedInfoWindowRef,
  });

  useMapClickInfoWindowCloser({
    map,
    fixedInfoWindowRef,
  });

  return null;
};