import { X, Navigation, Layers, Info, FileText } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useMapStore } from '../../../stores/useMapStore';
import { useCurrentLocation } from '../../../hooks/useCurrentLocation';
import { moveToFullView } from '../../map/components/MapControls/moveToFullView';
import { useMapLayer } from '../../../context/MapLayerContext';
import HeatGuideModal from './HeatGuideModal';
import { useState } from 'react';

interface MobileHomeMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileHomeMenu: React.FC<MobileHomeMenuProps> = ({ isOpen, onClose }) => {
  const map = useMapStore((state: any) => state.map);
  const { getLocation } = useCurrentLocation();
  const { setAllLayers } = useMapLayer();
  const [HeatGuideVisible, setHeatGuideVisible] = useState(false);

  const handleActionClick = (actionType: string) => {
    if (actionType === 'currentLocation') {
      getLocation(map);
    } else if (actionType === 'fullView') {
      if (map) {
        setAllLayers(true);
        moveToFullView(map);
      }
    } else if (actionType === 'heatGuide') {
      setHeatGuideVisible(true);
    } else if (actionType === 'help') {
      // Implement help action here, e.g., show a help dialog or navigate to a help page
      alert('도움말 기능은 아직 구현되지 않았습니다.');
    }
    onClose(); // Close the menu after an action is performed
  };

  return (
    <>
      <div
        className={`
          fixed left-0 w-full bg-white p-4 shadow-lg rounded-t-lg z-50
          transition-all duration-300 ease-out
        `}
        style={{
          maxHeight: 'calc(100vh - 4rem)', // 4rem (64px) is the height of MobileBottomNav
          bottom: isOpen ? '4rem' : '-100%',
        }}
      >
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="mt-4 space-y-2 pb-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-auto py-3"
            onClick={() => handleActionClick('currentLocation')}
          >
            <Navigation className="w-4 h-4" />
            현재 위치
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-auto py-3"
            onClick={() => handleActionClick('fullView')}
          >
            <Layers className="w-4 h-4" />
            전체보기
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-auto py-3"
            onClick={() => handleActionClick('help')}
          >
            <Info className="w-4 h-4" />
            도움말
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-auto py-3"
            onClick={() => handleActionClick('heatGuide')}
          >
            <FileText className="w-4 h-4" />
            온열질환 예방가이드
          </Button>
        </div>
      </div>
      <HeatGuideModal
        visible={HeatGuideVisible}
        onClose={() => setHeatGuideVisible(false)}
        imageUrl="/heat_guide.png"
      />
    </>
  );
};

export default MobileHomeMenu;
