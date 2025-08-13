import { useState } from 'react'; // useEffect is now in the hook
import { useMapLocation } from '../../../context/MapLocationContext';
import { useDebouncedCallback } from '../../../hooks/useDebouncedCallback';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { useMapLayer } from '../../../context/MapLayerContext';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { useKakaoMap } from '../hooks/useKakaoMap';
import { Layers } from './Layers';
import { TemperatureLegend } from './TemperatureLegend';
import { TemperatureSlider } from './TemperatureSlider';
import  ZoomControls from './MapControls/ZoomControls';
import { MobileTemperatureLegend } from './MobileTemperatureLegend';
import { MobileTemperatureSlider } from './MobileTemperatureSlider';
import KakaoMapLicense from '../../../components/KakaoMapLicense';
import { useMapLoading } from '../hooks/useMapLoading';
import FixedCenterMarker from './FixedCenterMarker';
import NotificationBanner from '../../../components/NotificationBanner';
import useChatNotification from '../../../hooks/useChatNotification'; // New import

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
      <div id="map" style={{ width: "100%", height: "100vh", position: "relative" }}>
        <FixedCenterMarker />
        <NotificationBanner
          message={notificationMessage}
          isVisible={showNotification}
          onClose={dismissNotification} // Use the dismiss function from the hook
        />
      </div>
      {isDesktop && <KakaoMapLicense />}


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

      {layerStates.tempDist && tempsByPolygon.length > 0 && (
        <>
          {isDesktop ? (
            <>
              <TemperatureLegend />
              <TemperatureSlider
                hourIndex={hourIndex}
                max={tempsByPolygon[0].length - 1}
                onChange={(val: number) => setHourIndex(val)}
              />
            </>
          ) : (
            <>
              <MobileTemperatureLegend />
              <MobileTemperatureSlider
                hourIndex={hourIndex}
                max={tempsByPolygon[0].length - 1}
                onChange={(val: number) => setHourIndex(val)}
              />
            </>
          )}
        </>
      )}
      {isDesktop && <ZoomControls map={map} defaultLevel={5} />}
    </>
  );
};

export default MapContainer;