import { MapPolygonLayer } from './layers/MapPolygonLayer';
import { MapCoolingCenterLayer } from './layers/MapCoolingCenterLayer';

interface LayersProps {
  map: any;
  layerStates: any;
  tempsByPolygon: number[][];
  setTempsByPolygon: (temps: number[][]) => void;
  hourIndex: number;
  onPolygonLayerLoad: () => void;
  onCoolingCenterLayerLoad: () => void;
}

export const Layers: React.FC<LayersProps> = ({
  map,
  layerStates,
  tempsByPolygon,
  setTempsByPolygon,
  hourIndex,
  onPolygonLayerLoad,
  onCoolingCenterLayerLoad,
}) => {
  return (
    <>
      <MapPolygonLayer
        map={map}
        layerStates={layerStates}
        tempsByPolygon={tempsByPolygon}
        setTempsByPolygon={setTempsByPolygon}
        hourIndex={hourIndex}
        onLoad={onPolygonLayerLoad}
      />
      <MapCoolingCenterLayer
        map={map}
        layerStates={layerStates}
        onLoad={onCoolingCenterLayerLoad}
      />
    </>
  );
};