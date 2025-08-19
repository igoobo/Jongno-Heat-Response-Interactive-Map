import { useEffect } from 'react';

interface UsePolygonInitializationProps {
  map: any;
  layerStates: any;
  onLoad: () => void;
  polygonsRef: React.RefObject<any[]>;
  polygonColorMapRef: React.RefObject<Map<any, string>>;
  polygonCentersRef: React.RefObject<any[]>;
  calculateCentroid: (coords: number[][]) => { lat: number; lon: number };
  fetchAndSetTemperatures: (currentPolygonCenters: { lat: number; lon: number }[]) => Promise<void>;
}

export const usePolygonInitialization = ({
  map,
  layerStates,
  onLoad,
  polygonsRef,
  polygonColorMapRef,
  polygonCentersRef,
  calculateCentroid,
  fetchAndSetTemperatures,
}: UsePolygonInitializationProps) => {
  const loadGeoJSON = async () => {
    const response = await fetch('/api/geojson');
    if (!response.ok) throw new Error('Failed to load GeoJSON file.');
    return await response.json();
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
};
