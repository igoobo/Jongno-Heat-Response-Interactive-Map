// src/components/sidebar/MapLayers.tsx
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { ToggleSwitch } from './ToggleSwitch';
import { Layers } from 'lucide-react';
import { useMapLayer } from '../../../context/MapLayerContext';
import { MAP_LAYERS_DATA } from '../constants/mapLayersData'; // Import the new constant

const MapLayers = () => {
  const { layerStates, toggleLayer } = useMapLayer();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Layers className="w-4 h-4" />
          지도 레이어
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {MAP_LAYERS_DATA.map((layer) => (
          <div key={layer.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${layer.color}`} />
              <span className="text-lg md:text-base">{layer.name}</span>
            </div>
            <ToggleSwitch
              id={layer.id} // Pass unique ID
              checked={layerStates[layer.id as keyof typeof layerStates]}
              onChange={() => toggleLayer(layer.id as keyof typeof layerStates)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MapLayers;
