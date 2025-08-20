import { useState } from 'react'; // useEffect is now in the hook
import { useMapLocation } from '../../../context/MapLocationContext';
import { useDebouncedCallback } from '../../../hooks/useDebouncedCallback';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { useMapLayer } from '../../../context/MapLayerContext';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { useKakaoMap } from '../hooks/useKakaoMap';
import { Layers } from './Layers';
import { useMapLoading } from '../hooks/useMapLoading';
import useChatNotification from '../../../hooks/useChatNotification'; // New import
import { MapTemperatureControls } from './MapTemperatureControls'; // New import
import { MapUIControls } from './MapUIControls'; // New import
import FixedCenterMarker from './FixedCenterMarker'; // Import FixedCenterMarker

interface MapContainerProps {
  onMapInstanceLoad: (map: any) => void;
}

const MapContainer: React.FC<MapContainerProps> = ({ onMapInstanceLoad }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { layerStates } = useMapLayer();
  const { setLocation } = useMapLocation();
  const debouncedSetLocation = useDebouncedCallback(setLocation, 300);
  const { totalLoading: mapSpecificLoading, setIsMapLoading, setIsPolygonLayerLoading, setIsCoolingCenterLayerLoading } = useMapLoading();

  const { message: notificationMessage, isVisible: showNotification, isLoading: isChatLoading, dismiss: dismissNotification } = useChatNotification(); // Destructure dismissNotification

  const totalLoading = mapSpecificLoading || isChatLoading; // Combine loading states

  const handleMapIdle = (map: any) => {
    const center = map.getCenter();
    const level = map.getLevel();
    debouncedSetLocation({
      lat: center.getLat(),
      lng: center.getLng(),
      zoom: level,
    });
  };

  const { map } = useKakaoMap({
    onMapIdle: handleMapIdle,
    onMapLoad: (mapInstance: any) => { // Pass mapInstance to onMapInstanceLoad
      setIsMapLoading(false);
      onMapInstanceLoad(mapInstance);
    }
  });

  const [tempsByPolygon, setTempsByPolygon] = useState<number[][]>([]);
  const [hourIndex, setHourIndex] = useState(0);

  return (
    <>
      {totalLoading && <LoadingOverlay />}
      <MapUIControls
        map={map}
        isDesktop={isDesktop}
        notificationMessage={notificationMessage}
        showNotification={showNotification}
        dismissNotification={dismissNotification}
      >
        <div id="map" style={{ width: "100%", height: "100vh", position: "relative" }}>
          {/* The actual map will be rendered here by KakaoMap API */}
          <FixedCenterMarker /> {/* Render FixedCenterMarker inside the map div */}
        </div>
      </MapUIControls>

      {map && (
        <Layers
          map={map}
          layerStates={layerStates}
          tempsByPolygon={tempsByPolygon}
          setTempsByPolygon={setTempsByPolygon}
          hourIndex={hourIndex}
          onPolygonLayerLoad={() => setIsPolygonLayerLoading(false)}
          onCoolingCenterLayerLoad={() => setIsCoolingCenterLayerLoading(false)}
        />
      )}

      <MapTemperatureControls
        isDesktop={isDesktop}
        layerStates={layerStates}
        tempsByPolygon={tempsByPolygon}
        hourIndex={hourIndex}
        setHourIndex={setHourIndex}
      />
    </>
  );
};

export default MapContainer;