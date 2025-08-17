import { useState } from 'react';
import MobileBottomNav from './MobileBottomNav';
import MobileMapLayersSidebar from './MobileMapLayersSidebar';
import MobileLocationSidebar from './MobileLocationSidebar';
import WeatherCard from '../../weather/components/WeatherCard';
import { MapLayersFab } from '../../map/components/MapLayersFab'; // Import MapLayersFab

export const MobileSidebar = () => {
  const [activeMobileSidebar, setActiveMobileSidebar] = useState<'location' | 'layers' | 'menu' | null>(null);

  return (
    <>
      <MobileBottomNav onSidebarChange={setActiveMobileSidebar} activeSidebar={activeMobileSidebar} />
      {activeMobileSidebar === 'location' && (
        <div className="absolute top-3 left-3 z-10 w-[30vw]">
          <WeatherCard />
        </div>
      )}
      <MobileLocationSidebar isOpen={activeMobileSidebar === 'location'} onClose={() => setActiveMobileSidebar(null)} />
      <MobileMapLayersSidebar isOpen={activeMobileSidebar === 'layers'} onClose={() => setActiveMobileSidebar(null)} />
      <MapLayersFab onClick={() => setActiveMobileSidebar('layers')} /> {/* Add MapLayersFab */}
    </>
  );
};