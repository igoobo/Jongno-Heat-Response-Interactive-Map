import { useEffect } from 'react';
import { usePolygons } from '../../hooks/usePolygons';
import { usePolygonTemperatureStyling } from '../../hooks/usePolygonTemperatureStyling'; // New import

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
  const { polygonsRef, polygonColorMapRef, polygonCentersRef } = usePolygons(map, layerStates, setTempsByPolygon, onLoad);

  useEffect(() => {
    if (!map || polygonsRef.current.length === 0) return;

    polygonsRef.current.forEach((polygon: any) => {
      polygon.setMap(layerStates.area ? map : null);
    });
  }, [layerStates.area, map]);

  usePolygonTemperatureStyling({
    map,
    layerStates,
    tempsByPolygon,
    hourIndex,
    polygonsRef,
    polygonColorMapRef,
    polygonCentersRef,
  });

  return null;
};