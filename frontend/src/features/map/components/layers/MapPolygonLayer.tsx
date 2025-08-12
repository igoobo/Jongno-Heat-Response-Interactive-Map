import { useEffect } from 'react';
import { getColorByTemperature } from '@/utils/colorUtils';
import { usePolygons } from '../../hooks/usePolygons';

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

  useEffect(() => {
    if (!layerStates.tempDist) {
      polygonsRef.current.forEach((polygon: any) => {
        polygon.setOptions({ fillColor: '#ffffff' });
        polygonColorMapRef.current.set(polygon, '#ffffff');
      });
      return;
    }

    polygonCentersRef.current.forEach(({ polygon }: any, index: number) => {
      const temp = tempsByPolygon[index]?.[hourIndex];
      if (temp != null) {
        const fillColor = getColorByTemperature(temp);
        polygon.setOptions({ fillColor });
        polygonColorMapRef.current.set(polygon, fillColor);
      }
    });
  }, [hourIndex, layerStates.tempDist, tempsByPolygon]);

  return null;
};