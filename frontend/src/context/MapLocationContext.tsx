import { createContext, useContext, useState, useMemo } from 'react';

interface Location {
  lat: number;
  lng: number;
  zoom: number;
}

interface MapLocationContextType {
  location: Location;
  setLocation: (loc: Location) => void;
}

const MapLocationContext = createContext<MapLocationContextType | undefined>(undefined);

export const MapLocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<Location>({
    lat: 37.5665,
    lng: 126.9780,
    zoom: 3,
  });

  const value = useMemo(() => ({ location, setLocation }), [location]);

  return (
    <MapLocationContext.Provider value={value}>
      {children}
    </MapLocationContext.Provider>
  );
};

export const useMapLocation = () => {
  const context = useContext(MapLocationContext);
  if (!context) throw new Error('useMapLocation must be used within MapLocationProvider');
  return context;
};
