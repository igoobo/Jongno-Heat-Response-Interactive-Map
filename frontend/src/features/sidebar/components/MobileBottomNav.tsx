import { Home, Layers, MapPin } from 'lucide-react';
import { useState } from 'react';
import MobileLocationSidebar from './MobileLocationSidebar';
import MobileMapLayersSidebar from './MobileMapLayersSidebar';

interface MobileBottomNavProps {
  onSidebarChange: (activeSidebar: 'location' | 'layers' | null) => void;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onSidebarChange }) => {
  const [activeSidebar, setActiveSidebar] = useState<'location' | 'layers' | null>(null);

  const handleButtonClick = (sidebarType: 'location' | 'layers') => {
    const newActiveSidebar = activeSidebar === sidebarType ? null : sidebarType;
    setActiveSidebar(newActiveSidebar);
    onSidebarChange(newActiveSidebar);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200">
        <div className="grid h-full max-w-lg grid-cols-3 mx-auto font-medium">
          <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50">
            <Home className="w-5 h-5 mb-2 text-gray-500" />
            <span className="text-sm text-gray-500">Home</span>
          </button>
          <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50" onClick={() => handleButtonClick('layers')}>
            <Layers className="w-5 h-5 mb-2 text-gray-500" />
            <span className="text-sm text-gray-500">Layers</span>
          </button>
          <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50" onClick={() => handleButtonClick('location')}>
            <MapPin className="w-5 h-5 mb-2 text-gray-500" />
            <span className="text-sm text-gray-500">Location</span>
          </button>
        </div>
      </div>
      <MobileLocationSidebar isOpen={activeSidebar === 'location'} onClose={() => setActiveSidebar(null)} />
      <MobileMapLayersSidebar isOpen={activeSidebar === 'layers'} onClose={() => setActiveSidebar(null)} />
    </>
  );
};

export default MobileBottomNav;