import { useState } from 'react'; // Import useState
import MapContainer from './features/map/components/MapContainer';
import { useMediaQuery } from './hooks/useMediaQuery';
import { AppLayout } from './components/AppLayout'; // New import
import { AppProviders } from './components/AppProviders'; // New import
import { GlobalOverlays } from './components/GlobalOverlays'; // New import

export default function App() {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [map, setMap] = useState<any>(null); // State to hold the map instance
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  return (
    <div className="h-screen w-full bg-background flex flex-col md:flex-row overflow-hidden">
      <AppProviders>
        <AppLayout isDesktop={isDesktop} map={map}>
          <MapContainer onMapInstanceLoad={setMap} />
        </AppLayout>
      </AppProviders>
      <GlobalOverlays
        isDesktop={isDesktop}
        isChatModalOpen={isChatModalOpen}
        setIsChatModalOpen={setIsChatModalOpen}
      />
    </div>
  );
}