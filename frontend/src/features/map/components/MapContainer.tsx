import { useState, useEffect } from 'react'; // Added useEffect
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
import NotificationBanner from '../../../components/NotificationBanner'; // New import

interface MapContainerProps {
  onMapInstanceLoad: (map: any) => void;
}

const MapContainer: React.FC<MapContainerProps> = ({ onMapInstanceLoad }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { layerStates } = useMapLayer();
  const { setLocation } = useMapLocation();
  const debouncedSetLocation = useDebouncedCallback(setLocation, 300);
  const { totalLoading: mapSpecificLoading, setIsMapLoading, setIsPolygonLayerLoading, setIsCoolingCenterLayerLoading } = useMapLoading();

  const [notificationMessage, setNotificationMessage] = useState('Loading message...'); // Initial loading message
  const [showNotification, setShowNotification] = useState(true); // Always show, content changes
  const [isChatLoading, setIsChatLoading] = useState(true); // New loading state for chat

  const totalLoading = mapSpecificLoading || isChatLoading; // Combine loading states

  useEffect(() => {
    const fetchChatResponse = async () => {
      setIsChatLoading(true); // Start loading
      try {
        const response = await fetch('/api/chat');
        const data = await response.json();
        if (data && data.answer) {
          setNotificationMessage(data.answer);
          setShowNotification(true); // Ensure it's visible if successful
        } else {
          // If no data.answer, treat as a soft failure, don't show banner
          setNotificationMessage(''); // Clear any previous message
          setShowNotification(false); // Hide banner
        }
      } catch (error) {
        console.error('Failed to fetch chat response:', error);
        // On hard failure (network error, etc.), treat as a soft failure, don't show banner
        setNotificationMessage(''); // Clear any previous message
        setShowNotification(false); // Hide banner
      } finally {
        setIsChatLoading(false); // End loading, regardless of success or failure
      }
    };

    fetchChatResponse();
  }, []); // Run once on component mount

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
          onClose={() => setShowNotification(false)}
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