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
    setLayerStates((prev) => ({
      ...prev,
      [layerId]: !prev[layerId],
    }));
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
