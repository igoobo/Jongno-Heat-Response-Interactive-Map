import KakaoMap from './components/KakaoMap';
import { MapLayerProvider } from './context/MapLayerContext';
import { MapLocationProvider } from './context/MapLocationContext';
import ModernSidebar from './components/ModernSidebar';

export default function App() {
  return (
    <div className="h-screen w-full bg-background flex flex-col md:flex-row overflow-hidden">
      <MapLocationProvider>
        <MapLayerProvider>
          <div className="flex-1 p-3 md:p-6">
            <div className="h-full w-full">
              <KakaoMap />
            </div>
          </div>
          <div className="h-64 md:h-full md:flex-shrink-0 md:flex md:flex-col">
            <ModernSidebar/>
          </div>
        </MapLayerProvider>
      </MapLocationProvider>
    </div>
  );
}