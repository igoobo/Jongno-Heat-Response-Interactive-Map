import { useState } from 'react';
import MobileBottomNav from './MobileBottomNav';
import MobileMapLayersSidebar from './MobileMapLayersSidebar';
import MobileLocationSidebar from './MobileLocationSidebar';
import WeatherCard from '../../weather/components/WeatherCard';
import { HeatIllnessGuide } from './heat-illness-guide/HeatIllnessGuide'; // Import HeatIllnessGuide
import { MapLayersFab } from '../../map/components/MobileMapLayersFab'; // Import MapLayersFa
import { SlideInPanel } from '../../../components/SlideInPanel'; // New import  x

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
      <SlideInPanel
        isOpen={activeMobileSidebar === 'heatGuide'}
        onClose={() => setActiveMobileSidebar(null)}
        animationStyle={{
          maxHeight: 'calc(100vh - 4rem)', // 4rem (64px) is the height of MobileBottomNav
          bottom: activeMobileSidebar === 'heatGuide' ? '4rem' : '-100%', // Move off-screen when closed
          overflowY: 'auto', // Enable scrolling for content
        }}
        containerClassName="p-4 rounded-t-lg"
      >
        <div className="mt-4 space-y-4 pb-4">
          <HeatIllnessGuide />
        </div>
      </SlideInPanel>
    </>
  );
};