import { Menu, Layers, MapPin } from 'lucide-react';
import MobileLocationSidebar from './MobileLocationSidebar';
import MobileMapLayersSidebar from './MobileMapLayersSidebar';
import { MobileMenu } from './MobileMenu';

interface MobileBottomNavProps {
  onSidebarChange: (activeSidebar: 'location' | 'layers' | 'menu' | null) => void;
  activeSidebar: 'location' | 'layers' | 'menu' | null; // Add this prop
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onSidebarChange, activeSidebar }) => {
  const handleButtonClick = (sidebarType: 'location' | 'layers' | 'menu') => {
    const newActiveSidebar = activeSidebar === sidebarType ? null : sidebarType;
    onSidebarChange(newActiveSidebar);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 z-100 w-full h-20 bg-white border-t border-gray-200">
        <div className="grid h-full max-w-lg grid-cols-3 mx-auto font-medium">
          <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50" onClick={() => handleButtonClick('menu')}>
            <Menu className="w-7 h-7 mb-2 text-gray-500" />
            <span className="text-lg text-gray-500">Menu</span>
          </button>
          <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50" onClick={() => handleButtonClick('layers')}>
            <Layers className="w-7 h-7 mb-2 text-gray-500" />
            <span className="text-lg text-gray-500">Layers</span>
          </button>
          <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50" onClick={() => handleButtonClick('location')}>
            <MapPin className="w-7 h-7 mb-2 text-gray-500" />
            <span className="text-lg text-gray-500">Location</span>
          </button>
        </div>
      </div>
      <MobileLocationSidebar isOpen={activeSidebar === 'location'} onClose={() => onSidebarChange(null)} />
      <MobileMapLayersSidebar isOpen={activeSidebar === 'layers'} onClose={() => onSidebarChange(null)} />
      <MobileMenu isOpen={activeSidebar === 'menu'} onClose={() => onSidebarChange(null)} />
    </>
  );
};

export default MobileBottomNav;