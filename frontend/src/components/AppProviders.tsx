import React from 'react';
import { MapLocationProvider } from '../context/MapLocationContext';
import { MapLayerProvider } from '../context/MapLayerContext';
import { CenterMarkerProvider } from '../context/CenterMarkerContext';
import KmaWeatherWarning from '../features/weather/KmaWeatherWarning';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <MapLocationProvider>
      <MapLayerProvider>
        <CenterMarkerProvider>
          <KmaWeatherWarning />
          {children}
        </CenterMarkerProvider>
      </MapLayerProvider>
    </MapLocationProvider>
  );
};
