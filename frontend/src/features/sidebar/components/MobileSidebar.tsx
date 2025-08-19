import { useState } from 'react';
import MobileBottomNav from './MobileBottomNav';
import MobileMapLayersSidebar from './MobileMapLayersSidebar';
import MobileLocationSidebar from './MobileLocationSidebar';
import WeatherCard from '../../weather/components/WeatherCard';
import { HeatIllnessGuide } from './heat-illness-guide/HeatIllnessGuide'; // Import HeatIllnessGuide
import { MapLayersFab } from '../../map/components/MobileMapLayersFab'; // Import MapLayersFa
import { X } from 'lucide-react'; // Import X

export const MobileSidebar = () => {
  const [activeMobileSidebar, setActiveMobileSidebar] = useState<'location' | 'layers' | 'menu' | 'heatGuide' | null>(null); // Add 'heatGuide'

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
      <MapLayersFab onClick={() => {
        if (activeMobileSidebar === 'layers') {
          setActiveMobileSidebar(null);
        } else {
          setActiveMobileSidebar('layers');
        }
      }} /> {/* Add MapLayersFab */}
      {activeMobileSidebar === 'heatGuide' && (
        <div
          className={`
            fixed left-0 w-full bg-white p-4 rounded-t-lg z-9000 
            transition-all duration-300 ease-out
          `}
          style={{
            maxHeight: 'calc(100vh - 4rem)', // 4rem (64px) is the height of MobileBottomNav
            bottom: activeMobileSidebar === 'heatGuide' ? '4rem' : '-100%', // Move off-screen when closed
            overflowY: 'auto', // Enable scrolling for content
          }}
        >
          <div className="flex justify-end">
            <button onClick={() => setActiveMobileSidebar(null)} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          <div className="mt-4 space-y-4 pb-4">
            <HeatIllnessGuide />
          </div>
          
        </div>
      )}
    </>
  );
};