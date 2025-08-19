import React from 'react';
import { TemperatureLegend } from './DesktopTemperatureLegend';
import { TemperatureSlider } from './DesktopTemperatureSlider';
import { MobileTemperatureLegend } from './MobileTemperatureLegend';
import { MobileTemperatureSlider } from './MobileTemperatureSlider';
import type { LayerStates } from '../../../context/MapLayerContext'; // Assuming this type is available

interface MapTemperatureControlsProps {
  isDesktop: boolean;
  layerStates: LayerStates; // Use the actual type for layerStates
  tempsByPolygon: number[][];
  hourIndex: number;
  setHourIndex: (val: number) => void;
}

export const MapTemperatureControls: React.FC<MapTemperatureControlsProps> = ({
  isDesktop,
  layerStates,
  tempsByPolygon,
  hourIndex,
  setHourIndex,
}) => {
  return (
    <>
      {layerStates.tempDist && tempsByPolygon.length > 0 && (
        <>
          {isDesktop ? (
            <>
              <TemperatureLegend />
              <TemperatureSlider
                hourIndex={hourIndex}
                max={tempsByPolygon[0].length - 1}
                onChange={(val: number) => setHourIndex(val)}
              />
            </>
          ) : (
            <>
              <MobileTemperatureLegend />
              <MobileTemperatureSlider
                hourIndex={hourIndex}
                max={tempsByPolygon[0].length - 1}
                onChange={(val: number) => setHourIndex(val)}
              />
            </>
          )}
        </>
      )}
    </>
  );
};
