import { useEffect, useState } from 'react';
import { useMapLocation } from '../context/MapLocationContext';
import { useDebouncedCallback } from '../hooks/useDebouncedCallback';
import KakaoMapLicense from './KakaoMapLicense';
import { useMapLayer } from '../context/MapLayerContext';
import LoadingOverlay from './LoadingOverlay';
import { useKakaoMap } from '../hooks/useKakaoMap';
import { MapPolygonLayer } from './map/MapPolygonLayer';
import { MapCoolingCenterLayer } from './map/MapCoolingCenterLayer';
import { TemperatureLegend } from './map/TemperatureLegend';
import { TemperatureSlider } from './map/TemperatureSlider';

const KakaoMap: React.FC = () => {
  const { layerStates } = useMapLayer();
  const { setLocation } = useMapLocation();
  const debouncedSetLocation = useDebouncedCallback(setLocation, 300);

  const [isMapLoading, setIsMapLoading] = useState(true);
  const [isPolygonLayerLoading, setIsPolygonLayerLoading] = useState(true);
  const [isCoolingCenterLayerLoading, setIsCoolingCenterLayerLoading] = useState(true);

  const totalLoading = isMapLoading || isPolygonLayerLoading || isCoolingCenterLayerLoading;

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

  useEffect(() => {
    if (map) {
      window.kakao.maps.event.addListener(map, 'click', () => {
        // This logic will be moved to MapCoolingCenterLayer
        // if (fixedInfoWindowRef.current) {
        //   fixedInfoWindowRef.current.close();
        //   fixedInfoWindowRef.current = null;
        // }
      });
    }
  }, [map]);

  return (
    <>
      {totalLoading && <LoadingOverlay />}
      <div id="map" style={{ width: "100%", height: "100vh" }}></div>
      <KakaoMapLicense />

      {map && (
        <>
          <MapPolygonLayer
            map={map}
            layerStates={layerStates}
            tempsByPolygon={tempsByPolygon}
            setTempsByPolygon={setTempsByPolygon}
            hourIndex={hourIndex}
            onLoad={() => setIsPolygonLayerLoading(false)}
          />
          <MapCoolingCenterLayer
            map={map}
            layerStates={layerStates}
            onLoad={() => setIsCoolingCenterLayerLoading(false)}
          />
        </>
      )}

      {layerStates.tempDist && tempsByPolygon.length > 0 && (
        <>
          <TemperatureLegend />
          <TemperatureSlider
            hourIndex={hourIndex}
            max={tempsByPolygon[0].length - 1}
            onChange={(val) => setHourIndex(val)}
          />
        </>
      )}
    </>
  );
};

export default KakaoMap;