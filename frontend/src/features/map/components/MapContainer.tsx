import { useState } from 'react';
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

const MapContainer: React.FC = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { layerStates } = useMapLayer();
  const { setLocation } = useMapLocation();
  const debouncedSetLocation = useDebouncedCallback(setLocation, 300);
  const { totalLoading, setIsMapLoading, setIsPolygonLayerLoading, setIsCoolingCenterLayerLoading } = useMapLoading();

  const handleMapIdle = (map: any) => {
    const center = map.getCenter();
    const level = map.getLevel();
    debouncedSetLocation({
      lat: center.getLat(),
      lng: center.getLng(),
      zoom: level,
    });
  };

  const { map } = useKakaoMap({ onMapIdle: handleMapIdle, onMapLoad: () => setIsMapLoading(false) });

  const [tempsByPolygon, setTempsByPolygon] = useState<number[][]>([]);
  const [hourIndex, setHourIndex] = useState(0);

  return (
    <>
      {totalLoading && <LoadingOverlay />}
      <div id="map" style={{ width: "100%", height: "100vh", position: "relative" }}>
        <FixedCenterMarker />
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


