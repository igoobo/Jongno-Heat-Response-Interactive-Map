import { useEffect, useRef, useState } from 'react';

import { usePolygonInitialization } from './usePolygonInitialization'; // New import

export const usePolygons = (map: any, setTempsByPolygon: (temps: number[][]) => void, onLoad: () => void) => {
  const polygonsRef = useRef<any[]>([]);
  const polygonCentersRef = useRef<{ polygon: any; centerLat: number; centerLon: number }[]>([]);
  const polygonColorMapRef = useRef<Map<any, string>>(new Map());
  const [lastFetchTimestamp, setLastFetchTimestamp] = useState(0);

  const CACHE_TTL_MS = 100 * 60 * 1000; // 100 minutes, matches backend cache TTL

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

    usePolygonInitialization({
    map,
    onLoad,
    polygonsRef,
    polygonColorMapRef,
    polygonCentersRef,
    calculateCentroid,
    fetchAndSetTemperatures,
  });

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