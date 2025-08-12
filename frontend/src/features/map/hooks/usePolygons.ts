import { useEffect, useRef, useState } from 'react';

export const usePolygons = (map: any, layerStates: any, setTempsByPolygon: any, onLoad: any) => {
  const polygonsRef = useRef<any[]>([]);
  const polygonCentersRef = useRef<{ polygon: any; centerLat: number; centerLon: number }[]>([]);
  const polygonColorMapRef = useRef<Map<any, string>>(new Map());
  const [lastFetchTimestamp, setLastFetchTimestamp] = useState(0);

  const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes, matches backend cache TTL

  const loadGeoJSON = async () => {
    const response = await fetch('/api/geojson');
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

  const loadTemperatureData = async (polygonCenters: { lat: number; lon: number }[]) => {
    const coords = polygonCenters.map(center => ({ lat: center.lat, lng: center.lon }));
    const response = await fetch('/api/polygon-temperatures', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(coords),
    });
    if (!response.ok) throw new Error('Failed to fetch polygon temperatures from backend');
    return response.json();
  };

  const fetchAndSetTemperatures = async (currentPolygonCenters: { lat: number; lon: number }[]) => {
    console.log('usePolygons: Calling loadTemperatureData');
    const temps = await loadTemperatureData(currentPolygonCenters); // Pass collected centroids
    setTempsByPolygon(temps); // Set temps from backend
    setLastFetchTimestamp(Date.now()); // Update timestamp after successful fetch
  };

  useEffect(() => {
    const initPolygons = async () => {
      console.log('usePolygons: initPolygons called');
      if (!map || !window.kakao) return;

      try {
        const geojson = await loadGeoJSON();
        const currentPolygonCenters: { lat: number; lon: number }[] = [];

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
            fillOpacity: 0.3,
          });
          polygonColorMapRef.current.set(polygon, originalFillColor);

          const { lat, lon } = calculateCentroid(coords);
          currentPolygonCenters.push({ lat, lon }); // Collect centroids
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
            map.setLevel(4);
            map.panTo(new window.kakao.maps.LatLng(lat, lon));
          });
        });

        await fetchAndSetTemperatures(currentPolygonCenters); // Initial fetch
      } catch (err) {
        console.error("Error initializing polygons:", err);
      } finally {
        onLoad();
      }
    };

    initPolygons();
  }, [map]);

  // Set up interval for re-fetching data when cache expires
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (lastFetchTimestamp > 0) {
      intervalId = setInterval(() => {
        const now = Date.now();
        if (now - lastFetchTimestamp >= CACHE_TTL_MS) {
          console.log('usePolygons: Cache expired, re-fetching data...');
          // Trigger re-fetch by calling the function that fetches and sets temperatures
          // Ensure polygonCentersRef.current is populated before calling
          if (polygonCentersRef.current.length > 0) {
            fetchAndSetTemperatures(polygonCentersRef.current.map(p => ({ lat: p.centerLat, lon: p.centerLon })));
          }
        }
      }, 5000); // Check every 5 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [lastFetchTimestamp, map]); // Depend on lastFetchTimestamp and map

  return { polygonsRef, polygonColorMapRef, polygonCentersRef };
};