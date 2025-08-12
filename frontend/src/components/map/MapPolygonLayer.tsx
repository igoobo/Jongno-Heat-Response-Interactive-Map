import { useEffect, useRef } from 'react';
import { fetchHourlyForecast } from '../../services/openWeatherService';
import { getColorByTemperature } from '../../utils/colorUtils';

interface MapPolygonLayerProps {
  map: any;
  layerStates: any;
  tempsByPolygon: number[][];
  setTempsByPolygon: (temps: number[][]) => void;
  hourIndex: number;
}

export const MapPolygonLayer: React.FC<MapPolygonLayerProps> = ({
  map,
  layerStates,
  tempsByPolygon,
  setTempsByPolygon,
  hourIndex,
}) => {
  const polygonsRef = useRef<any[]>([]);
  const polygonCentersRef = useRef<{ polygon: any; centerLat: number; centerLon: number }[]>([]);

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
    const temps: number[][] = [];
    for (const { centerLat, centerLon } of polygonCentersRef.current) {
      const hourlyTemps = await fetchHourlyForecast(centerLat, centerLon);
      temps.push(hourlyTemps.list.slice(0, 8).map((item: any) => item.main.temp));
    }
    setTempsByPolygon(temps);
  };

  useEffect(() => {
    const initPolygons = async () => {
      if (!map || !window.kakao) return;

      try {
        const geojson = await loadGeoJSON();

        geojson.features.forEach((feature: any) => {
          const coords = feature.geometry.coordinates[0];
          const path = coords.map(([lon, lat]: number[]) => new window.kakao.maps.LatLng(lat, lon));

          const polygon = new window.kakao.maps.Polygon({
            map: layerStates.area ? map : null,
            path,
            strokeWeight: 2,
            strokeColor: '#004c80',
            strokeOpacity: 0.8,
            fillColor: '#ffffff',
            fillOpacity: 0.5,
          });

          const { lat, lon } = calculateCentroid(coords);
          polygonCentersRef.current.push({ polygon, centerLat: lat, centerLon: lon });
          polygonsRef.current.push(polygon);

          window.kakao.maps.event.addListener(polygon, 'mouseover', () => {
            polygon.setOptions({ fillColor: '#09f' });
          });

          window.kakao.maps.event.addListener(polygon, 'mouseout', () => {
            polygon.setOptions({ fillColor: '#ffffff' });
          });
        });

        await loadTemperatureData();
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
      });
      return;
    }

    polygonCentersRef.current.forEach(({ polygon }, index) => {
      const temp = tempsByPolygon[index]?.[hourIndex];
      if (temp != null) {
        const fillColor = getColorByTemperature(temp);
        polygon.setOptions({ fillColor });
      }
    });
  }, [hourIndex, layerStates.tempDist, tempsByPolygon]);

  return null;
};
