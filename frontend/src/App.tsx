import { useState } from 'react'; // Import useState
import MapContainer from './features/map/components/MapContainer';
import { MapLayerProvider } from './context/MapLayerContext';
import { MapLocationProvider } from './context/MapLocationContext';
import { CenterMarkerProvider } from './context/CenterMarkerContext'; // Import the new provider
import { DesktopSidebar } from './features/sidebar/components/DesktopSidebar';
import { MobileSidebar } from './features/sidebar/components/MobileSidebar';
import { useMediaQuery } from './hooks/useMediaQuery';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import KmaWeatherWarning from './features/weather/KmaWeatherWarning';

export default function App() {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [map, setMap] = useState<any>(null); // State to hold the map instance

  return (
    <div className="h-screen w-full bg-background flex flex-col md:flex-row overflow-hidden">
      <MapLocationProvider>
        <MapLayerProvider>
                    <CenterMarkerProvider> {/* Wrap MapContainer with CenterMarkerProvider */}
            <KmaWeatherWarning />
            <div className="flex-1 p-3 md:p-6">
              <div className="h-full w-full">
                <MapContainer onMapInstanceLoad={setMap} /> {/* Pass setMap callback */}
              </div>
            </div>
          </CenterMarkerProvider>
          {isDesktop ? (
            <div className="h-64 md:h-full md:flex-shrink-0 md:flex md:flex-col">
              <DesktopSidebar map={map} /> {/* Pass map instance */}
            </div>
          ) : (
            <MobileSidebar />
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