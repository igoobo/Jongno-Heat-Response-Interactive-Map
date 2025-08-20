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
  const { polygonsRef, polygonColorMapRef, polygonCentersRef } = usePolygons(map, setTempsByPolygon, onLoad);

  useEffect(() => {
    if (!map || polygonsRef.current.length === 0) return;

    polygonsRef.current.forEach((polygon: any) => {
      if (layerStates.area) {
        polygon.setOptions({ strokeColor: '#004c80', strokeOpacity: 0.8 });
      } else {
        polygon.setOptions({ strokeOpacity: 0 });
      }
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