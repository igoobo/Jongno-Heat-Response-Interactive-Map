import React, { useState } from 'react'; // Import React and useState
import { MOBILE_MENU_ACTIONS } from '../constants/mobileMenuActions';
import * as LucideIcons from 'lucide-react';

const IconMap: { [key: string]: React.ElementType } = {
  Navigation: LucideIcons.Navigation,
  Layers: LucideIcons.Layers,
  FileText: LucideIcons.FileText,
  MapPin: LucideIcons.MapPin,
  // Add other icons as needed
};
import { Button } from '../../../components/ui/button';
import { useMapStore } from '../../../stores/useMapStore';
import { moveToFullView } from '../../map/components/MapControls/moveToFullView';
import { useMapLayer } from '../../../context/MapLayerContext';
import HeatGuideModal from './HeatGuideModal';
import { toast } from 'react-toastify'; // Import toast
import { useCurrentLocation } from '../../../hooks/useCurrentLocation'; // Import useCurrentLocation
import { useClosestCoolingCenterAction } from '../hooks/useClosestCoolingCenterAction'; // New import
import { SlideInPanel } from '../../../components/SlideInPanel'; // New import

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenuSidebar: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const map = useMapStore((state: any) => state.map);
  const { setAllLayers, setLayerState } = useMapLayer(); // Destructure setLayerState
  const [HeatGuideVisible, setHeatGuideVisible] = useState(false);
  const { getLocation } = useCurrentLocation(); // Call the hook

  const { selectedFacilityType, setSelectedFacilityType, handleClosestRestAction } = useClosestCoolingCenterAction({
    map,
    setLayerState,
    onClose,
  });

  const handleCurrentLocationClick = async () => {
    if (map) {
      await getLocation(map, true);
    } else {
      toast.error("지도를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const handleFullViewClick = () => {
    if (map) {
      setAllLayers(true);
      moveToFullView(map);
    }
  };

  const handleClosestRestClick = async () => {
    await handleClosestRestAction();
  };

  const handleHeatGuideClick = () => {
    setHeatGuideVisible(true);
  };

  const handleHelpClick = () => {
    alert('도움말 기능은 아직 구현되지 않습니다.');
  };

  const handleActionClick = async (actionType: string) => {
    switch (actionType) {
      case 'currentLocation':
        await handleCurrentLocationClick();
        break;
      case 'fullView':
        handleFullViewClick();
        break;
      case 'closestRest':
        await handleClosestRestClick();
        break;
      case 'heatGuide':
        handleHeatGuideClick();
        break;
      case 'help':
        handleHelpClick();
        break;
      default:
        break;
    }
    onClose();
  };

  return (
    <SlideInPanel
      isOpen={isOpen}
      onClose={onClose}
      animationStyle={{
        bottom: '4rem', // Fixed position above the bottom nav
        maxHeight: isOpen ? 'calc(100vh - 4rem)' : '0', // Animate height
        overflow: 'hidden',
      }}
      containerClassName="p-4 rounded-t-lg"
    >
      <div className="mt-4 space-y-2 pb-4">
        {MOBILE_MENU_ACTIONS.map((action) => {
          const Icon = IconMap[action.icon];
          if (action.type === 'closestRest') {
            return (
              <div key={action.type} className="w-full flex items-center justify-between gap-2">
                <Button
                  variant="ghost"
                  className="text-lg md:text-sm flex-grow justify-start gap-3 h-auto py-3"
                  onClick={() => handleActionClick(action.type)}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {action.label}
                </Button>
                <select
                  id="mobileFacilityType"
                  name="mobileFacilityType"
                  className="block w-auto pl-3 pr-2 py-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                  value={selectedFacilityType}
                  onChange={(e) => setSelectedFacilityType(e.target.value)}
                >
                  <option value="">모두</option>
                  <option value="공공시설">공공시설</option>
                  <option value="특정계층이용시설">특정계층이용시설</option>
                </select>
              </div>
            );
          } else {
            return (
              <Button
                key={action.type}
                variant="ghost"
                className="text-lg md:text-sm w-full justify-start gap-3 h-auto py-3"
                onClick={() => handleActionClick(action.type)}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {action.label}
              </Button>
            );
          }
        })}
        <HeatGuideModal
          visible={HeatGuideVisible}
          onClose={() => setHeatGuideVisible(false)}
          imageUrl="/heat_guide.png"
        />
      </div>
      
      
    </SlideInPanel>
  );
};

export { MobileMenuSidebar }; // Export MobileMenuSidebar