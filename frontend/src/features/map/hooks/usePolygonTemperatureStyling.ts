import { useEffect } from 'react';
import { getColorByTemperature } from '@/utils/colorUtils';
import type { LayerStates } from '../../../context/MapLayerContext';

interface UsePolygonTemperatureStylingProps {
  map: any;
  layerStates: LayerStates;
  tempsByPolygon: number[][];
  hourIndex: number;
  polygonsRef: React.RefObject<any[]>;
  polygonColorMapRef: React.RefObject<Map<any, string>>;
  polygonCentersRef: React.RefObject<any[]>;
}

export const usePolygonTemperatureStyling = ({
  map,
  layerStates,
  tempsByPolygon,
  hourIndex,
  polygonsRef,
  polygonColorMapRef,
  polygonCentersRef,
}: UsePolygonTemperatureStylingProps) => {
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
  }, [hourIndex, layerStates.tempDist, tempsByPolygon, map, polygonsRef, polygonColorMapRef, polygonCentersRef]);
};
