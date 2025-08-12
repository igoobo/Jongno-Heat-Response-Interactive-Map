import MapLayers from './MapLayers';
import QuickActions from './QuickActions';
import { MapPin } from 'lucide-react';

interface DesktopSidebarProps {}

const DesktopSidebarB: React.FC<DesktopSidebarProps> = () => {
  return (
    <div className="hidden md:block w-full h-full bg-white border-t md:border-t-0 md:border-l border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">종로구 지도</h2>
            <p className="text-sm text-muted-foreground">Seoul, South Korea</p>
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4">
        <MapLayers />
        <QuickActions />
      </div>
      <div className="mt-auto p-6 border-t border-border">
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            Jongno Heat Response Interactive Map
          </p>
          <footer className="text-xs text-muted-foreground">
            Weather data provided by <a href="https://openweathermap.org/">OpenWeather</a> © 2012–2025 OpenWeather®
          </footer>
        </div>
      </div>
    </div>
  );
};

export default DesktopSidebarB;