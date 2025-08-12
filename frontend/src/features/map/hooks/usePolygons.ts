import { useEffect, useRef } from 'react';
import { fetchHourlyForecast } from '../../weather/services/openWeatherService';
import { interpolateTemperatures } from '@/utils/interpolationUtils';

export const usePolygons = (map: any, layerStates: any, setTempsByPolygon: any, onLoad: any) => {
  const polygonsRef = useRef<any[]>([]);
  const polygonCentersRef = useRef<{ polygon: any; centerLat: number; centerLon: number }[]>([]);
  const polygonColorMapRef = useRef<Map<any, string>>(new Map());

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
    const interpolatedTemps: number[][] = [];
    for (const { centerLat, centerLon } of polygonCentersRef.current) {
      const hourlyData = await fetchHourlyForecast(centerLat, centerLon);
      const originalTemps = hourlyData.list.slice(0, 8).map((item: any) => item.main.temp);
      const interpolated1hr = interpolateTemperatures(originalTemps);
      interpolatedTemps.push(interpolated1hr);
    }
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
          let originalFillColor = '#ffffff';

          const polygon = new window.kakao.maps.Polygon({
            map: layerStates.area ? map : null,
            path,
            strokeWeight: 2,
            strokeColor: '#004c80',
            strokeOpacity: 0.8,
            fillColor: originalFillColor,
            fillOpacity: 0.5,
          });
          polygonColorMapRef.current.set(polygon, originalFillColor);

          const { lat, lon } = calculateCentroid(coords);
          polygonCentersRef.current.push({ polygon, centerLat: lat, centerLon: lon });
          polygonsRef.current.push(polygon);

          window.kakao.maps.event.addListener(polygon, 'mouseover', () => {
            const currentColor = polygonColorMapRef.current.get(polygon) ?? '#ffffff';
            polygonColorMapRef.current.set(polygon, currentColor);
            polygon.setOptions({ fillColor: '#09f' });
          });

          window.kakao.maps.event.addListener(polygon, 'mouseout', () => {
            const original = polygonColorMapRef.current.get(polygon) ?? '#ffffff';
            polygon.setOptions({ fillColor: original });
          });

          window.kakao.maps.event.addListener(polygon, 'click', () => {
            map.setLevel(3);
            map.panTo(new window.kakao.maps.LatLng(lat, lon));
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

  return { polygonsRef, polygonColorMapRef, polygonCentersRef };
};