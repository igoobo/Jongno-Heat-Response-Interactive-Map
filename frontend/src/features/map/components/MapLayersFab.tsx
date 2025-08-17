import React from 'react';
import { Layers } from 'lucide-react';

interface MapLayersFabProps {
  onClick: () => void;
}

export const MapLayersFab: React.FC<MapLayersFabProps> = ({ onClick }) => {
  return (
    <button
      className="fixed top-35 right-4 z-40 bg-white text-balck border-2 rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors duration-200"
      onClick={onClick}
      aria-label="Map Layers"
    >
      <Layers size={24} />
    </button>
  );
};