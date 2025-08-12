// src/context/MapLayerContext.tsx
import { createContext, useContext, useState } from 'react';

type LayerStates = {
  tempDist: boolean;
  coolingCenter: boolean;
  area: boolean;
};

const defaultState: LayerStates = {
  tempDist: false,
  coolingCenter: false, // ✅ 처음부터 false
  area: true,
};

const MapLayerContext = createContext<{
  layerStates: LayerStates;
  toggleLayer: (layerId: keyof LayerStates) => void;
} | null>(null);

export const MapLayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [layerStates, setLayerStates] = useState<LayerStates>(defaultState);

  const toggleLayer = (layerId: keyof LayerStates) => {
    setLayerStates((prev) => {
      const newValue = !prev[layerId];

      switch (layerId) {
        case 'tempDist':
          // tempDist를 true로 바꾸면 area도 무조건 true로 변경
          if (newValue) {
            return {
              ...prev,
              tempDist: true,
              area: true,
            };
          }
          // tempDist를 false로 바꾸면 tempDist만 false로 변경
          return {
            ...prev,
            tempDist: false,
          };

        case 'area':
          // area를 false로 바꾸려고 할 때 tempDist가 true면 tempDist도 false로 변경
          if (!newValue && prev.tempDist) {
            return {
              ...prev,
              area: false,
              tempDist: false,
            };
          }
          // 그 외에는 area만 토글
          return {
            ...prev,
            area: newValue,
          };

        default:
          // 다른 레이어들은 그냥 토글
          return {
            ...prev,
            [layerId]: newValue,
          };
      }
    });
  };

  return (
    <MapLayerContext.Provider value={{ layerStates, toggleLayer }}>
      {children}
    </MapLayerContext.Provider>
  );
};

export const useMapLayer = () => {
  const ctx = useContext(MapLayerContext);
  if (!ctx) throw new Error('useMapLayer must be used within MapLayerProvider');
  return ctx;
};
