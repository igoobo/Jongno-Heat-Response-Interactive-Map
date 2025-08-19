import MobileLocationSidebar from './MobileLocationSidebar';
import MobileMapLayersSidebar from './MobileMapLayersSidebar';
import { MobileMenuSidebar } from './MobileMenuSidebar';
import { MOBILE_NAV_BUTTONS } from '../constants/mobileNavButtons'; // Import the new constant

interface MobileBottomNavProps {
  onSidebarChange: (activeSidebar: 'location' | 'layers' | 'menu' | 'heatGuide' | null) => void; // Add 'heatGuide'
  activeSidebar: 'location' | 'layers' | 'menu' | 'heatGuide' | null; // Add 'heatGuide'
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onSidebarChange, activeSidebar }) => {
  const handleButtonClick = (sidebarType: 'location' | 'layers' | 'menu' | 'heatGuide') => {
    const newActiveSidebar = activeSidebar === sidebarType ? null : sidebarType;
    onSidebarChange(newActiveSidebar);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 z-10000 w-full h-20 bg-white border-t border-gray-200">
        <div className="grid h-full max-w-lg grid-cols-3 mx-auto font-medium">
          {MOBILE_NAV_BUTTONS.map((button) => (
            <button
              key={button.sidebarType}
              type="button"
              className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50"
              onClick={() => handleButtonClick(button.sidebarType as 'location' | 'layers' | 'menu' | 'heatGuide')}
            >
              <button.icon className="w-7 h-7 mb-2 text-gray-500" />
              <span className="text-lg text-gray-500">{button.label}</span>
            </button>
          ))}
        </div>
      </div>
      <MobileLocationSidebar isOpen={activeSidebar === 'location'} onClose={() => onSidebarChange(null)} />
      <MobileMapLayersSidebar isOpen={activeSidebar === 'layers'} onClose={() => onSidebarChange(null)} />
      <MobileMenuSidebar isOpen={activeSidebar === 'menu'} onClose={() => onSidebarChange(null)} />
    </>
  );
};

export default MobileBottomNav;