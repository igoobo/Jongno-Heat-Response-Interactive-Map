import { useEffect, useRef } from 'react';
import { fetchHourlyForecast } from '../../../weather/services/openWeatherService';
import { getColorByTemperature } from '../../../../utils/colorUtils';
import { interpolateTemperatures } from '../../../../utils/interpolationUtils';

interface MapPolygonLayerProps {
  map: any;
  layerStates: any;
  tempsByPolygon: number[][];
  setTempsByPolygon: (temps: number[][]) => void;
  hourIndex: number;
  onLoad: () => void;
}

export const MapPolygonLayer: React.FC<MapPolygonLayerProps> = ({
  map,
  layerStates,
  tempsByPolygon,
  setTempsByPolygon,
  hourIndex,
  onLoad,
}) => {
  const polygonsRef = useRef<any[]>([]);
  const polygonCentersRef = useRef<{ polygon: any; centerLat: number; centerLon: number }[]>([]);
  const polygonColorMapRef = useRef<Map<any, string>>(new Map()); // ✅ 색상 저장용 Map

  const loadGeoJSON = async () => {
    const response = await fetch('/jongno_wgs84.geojson');
    if (!response.ok) throw new Error('Failed to load GeoJSON file.');
    return await response.json();
  };

  const calculateCentroid = (coords: number[][]): { lat: number; lon: number } => {
    const lats = coords.map((coord) => coord[1]);
    const lons = coords.map((coord) => coord[0]);

    const avgLat = lats.reduce((sum, val) => sum + val, 0) / lats.length;
    const avgLon = lons.reduce((sum, val) => sum + val, 0) / lons.length;

    return { lat: avgLat, lon: avgLon };
  };

  const loadTemperatureData = async () => {
    const interpolatedTemps: number[][] = []; // 보간된 1시간 단위 온도를 저장할 배열

    for (const { centerLat, centerLon } of polygonCentersRef.current) {
      const hourlyData = await fetchHourlyForecast(centerLat, centerLon);
      
      // 1. API로부터 3시간 간격의 원본 데이터를 추출합니다. (기존과 동일)
      const originalTemps = hourlyData.list.slice(0, 8).map((item: any) => item.main.temp);
      
      // 2. 3시간 간격 데이터를 1시간 간격 데이터로 보간합니다. (⭐️ 변경점)
      const interpolated1hr = interpolateTemperatures(originalTemps);
      
      interpolatedTemps.push(interpolated1hr);
    }
    
    // 3. 보간된 1시간 간격 데이터를 상태로 저장합니다. (⭐️ 변경점)
    setTempsByPolygon(interpolatedTemps);
  };

  useEffect(() => {
    const initPolygons = async () => {
      if (!map || !window.kakao) return;

      try {
        const geojson = await loadGeoJSON();

        geojson.features.forEach((feature: any) => {
          const coords = feature.geometry.coordinates[0];
          const path = coords.map(([lon, lat]: number[]) => new window.kakao.maps.LatLng(lat, lon));
          
          let originalFillColor = '#ffffff'; // Initialize with default white

          const polygon = new window.kakao.maps.Polygon({
            map: layerStates.area ? map : null,
            path,
            strokeWeight: 2,
            strokeColor: '#004c80',
            strokeOpacity: 0.8,
            fillColor: originalFillColor, // Default to white initially
            fillOpacity: 0.5,
          });
          polygonColorMapRef.current.set(polygon, originalFillColor); // ✅ 초기 색상 저장

          const { lat, lon } = calculateCentroid(coords);
          polygonCentersRef.current.push({ polygon, centerLat: lat, centerLon: lon });
          polygonsRef.current.push(polygon);

        
          window.kakao.maps.event.addListener(polygon, 'mouseover', () => {
            console.log("Mouse over polygon");
            // 현재 색상 저장 (덮어쓰기)
            const currentColor = polygonColorMapRef.current.get(polygon) ?? '#ffffff';
            polygonColorMapRef.current.set(polygon, currentColor);
            polygon.setOptions({ fillColor: '#09f' });
          });

          window.kakao.maps.event.addListener(polygon, 'mouseout', () => {
            const original = polygonColorMapRef.current.get(polygon) ?? '#ffffff';
            polygon.setOptions({ fillColor: original });
          });

          window.kakao.maps.event.addListener(polygon, 'click', () => {
            map.setLevel(3); // 예: 더 가까이 줌
            map.panTo(new window.kakao.maps.LatLng(lat, lon)); // 중심 이동
          });
        });

          

        await loadTemperatureData();
        onLoad();
      } catch (err) {
        console.error("Error initializing polygons:", err);
      }
    };

    initPolygons();
  }, [map]);

  useEffect(() => {
    if (!map || polygonsRef.current.length === 0) return;

    polygonsRef.current.forEach((polygon) => {
      polygon.setMap(layerStates.area ? map : null);
    });
  }, [layerStates.area, map]);

  useEffect(() => {
    if (!layerStates.tempDist) {
      polygonsRef.current.forEach((polygon) => {
        polygon.setOptions({ fillColor: '#ffffff' });
        polygonColorMapRef.current.set(polygon, '#ffffff'); // ✅ 색상 추적도 갱신
      });
      return;
    }

    polygonCentersRef.current.forEach(({ polygon }, index) => {
      const temp = tempsByPolygon[index]?.[hourIndex];
      if (temp != null) {
        const fillColor = getColorByTemperature(temp);
        polygon.setOptions({ fillColor });
        polygonColorMapRef.current.set(polygon, fillColor); // ✅ 현재 색상 저장
      }
    });
  }, [hourIndex, layerStates.tempDist, tempsByPolygon]);

  return null;
};
