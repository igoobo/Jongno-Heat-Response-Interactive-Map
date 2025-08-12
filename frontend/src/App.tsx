import MapContainer from './features/map/components/MapContainer';
import { MapLayerProvider } from './context/MapLayerContext';
import { MapLocationProvider } from './context/MapLocationContext';
import ModernSidebar from './features/sidebar/components/ModernSidebar';
import MobileBottomNav from './features/sidebar/components/MobileBottomNav';
import { useMediaQuery } from './hooks/useMediaQuery';
import WeatherCard from './features/weather/components/WeatherCard';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import MobileMapLayersSidebar from './features/sidebar/components/MobileMapLayersSidebar';
import MobileLocationSidebar from './features/sidebar/components/MobileLocationSidebar';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [activeMobileSidebar, setActiveMobileSidebar] = useState<'location' | 'layers' | 'menu' | null>(null);
  return (
    <div className="h-screen w-full bg-background flex flex-col md:flex-row overflow-hidden">
      <MapLocationProvider>
        <MapLayerProvider>
          <div className="flex-1 p-3 md:p-6">
            <div className="h-full w-full">
              <MapContainer />
            </div>
          </div>
          {isDesktop ? (
            <div className="h-64 md:h-full md:flex-shrink-0 md:flex md:flex-col">
              <ModernSidebar />
            </div>
          ) : (
            <>
              <MobileBottomNav onSidebarChange={setActiveMobileSidebar} activeSidebar={activeMobileSidebar} />
              {activeMobileSidebar === 'location' && (
                <div className="absolute top-3 left-3 z-10 w-[30vw]">
                  <WeatherCard />
                </div>
              )}
              <MobileLocationSidebar isOpen={activeMobileSidebar === 'location'} onClose={() => setActiveMobileSidebar(null)} />
              <MobileMapLayersSidebar isOpen={activeMobileSidebar === 'layers'} onClose={() => setActiveMobileSidebar(null)} />
            </>
          )}
        </MapLayerProvider>
      </MapLocationProvider>
      <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
    </div>
  );
}