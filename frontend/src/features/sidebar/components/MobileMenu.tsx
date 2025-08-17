import { X, Navigation, Layers, Info, MapPin } from 'lucide-react'; // Import MapPin icon
import { Button } from '../../../components/ui/button';
import { useMapStore } from '../../../stores/useMapStore';
import { moveToFullView } from '../../map/components/MapControls/moveToFullView';
import { useMapLayer } from '../../../context/MapLayerContext';
import HeatGuideModal from './HeatGuideModal';
import { useState } from 'react';
import { toast } from 'react-toastify'; // Import toast
import { useCurrentLocation } from '../../../hooks/useCurrentLocation'; // Import useCurrentLocation

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const map = useMapStore((state: any) => state.map);
  const { setAllLayers, setLayerState } = useMapLayer(); // Destructure setLayerState
  const [HeatGuideVisible, setHeatGuideVisible] = useState(false);
  const [selectedFacilityType, setSelectedFacilityType] = useState<string>(''); // State for selected facility type
  const { getLocation } = useCurrentLocation(); // Call the hook

  const handleActionClick = async (actionType: string) => { // Make async
    if (actionType === 'currentLocation') {
      if (map) {
        await getLocation(map, true); // Pass map and true to pan
      } else {
        toast.error("지도를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      }
    } else if (actionType === 'fullView') {
      if (map) {
        setAllLayers(true);
        moveToFullView(map);
      }
    } else if (actionType === 'closestRest') { // New action
      if (!map) return;

      const center = map.getCenter();
      const currentPosition = {
        lat: center.getLat(),
        lng: center.getLng(),
      };

      try {
        let url = `/api/closest-cooling-center?lat=${currentPosition.lat}&lng=${currentPosition.lng}`;
        if (selectedFacilityType) { // Add filter to URL
          url += `&facility_type1=${selectedFacilityType}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch closest cooling center');
        }
        const data = await response.json();
        if (map && data.lat && data.lon) {
          if (window.kakao && window.kakao.maps) {
            const moveLatLon = new window.kakao.maps.LatLng(parseFloat(data.lat), parseFloat(data.lon));
            setTimeout(() => {
              map.panTo(moveLatLon);
            }, 500);
          }
        }
        setLayerState('coolingCenter', true); // Enable coolingCenter layer
        toast.success("지도 중심에서 가장 가까운 무더위 쉼터로 이동했습니다!");
      } catch (err) {
        console.error("Error fetching closest cooling center:", err);
        toast.error("무더위 쉼터를 찾는 중 오류가 발생했습니다.");
      }
    } else if (actionType === 'heatGuide') {
      setHeatGuideVisible(true);
    } else if (actionType === 'help') {
      // Implement help action here, e.g., show a help dialog or navigate to a help page
      alert('도움말 기능은 아직 구현되지 않습니다.');
    }
    onClose(); // Close the menu after an action is performed
  };

  return (
    <>
      <div
        className={`
          fixed left-0 w-full bg-white p-4 rounded-t-lg z-50
          transition-all duration-300 ease-out
        `}
        style={{
          bottom: '4rem', // Fixed position above the bottom nav
          maxHeight: isOpen ? 'calc(100vh - 4rem)' : '0', // Animate height
          overflow: 'hidden', // Hide content when collapsed
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
            className="text-lg md:text-sm w-full justify-start gap-3 h-auto py-3"
            onClick={() => handleActionClick('currentLocation')}
          >
            <Navigation className="w-4 h-4" />
            현재 위치
          </Button>
          <Button
            variant="ghost"
            className="text-lg md:text-sm w-full justify-start gap-3 h-auto py-3"
            onClick={() => handleActionClick('fullView')}
          >
            <Layers className="w-4 h-4" />
            전체보기
          </Button>
          <div className="w-full flex items-center justify-between gap-2"> {/* Wrapper div for button and select, using flexbox */}
            <Button
              variant="ghost"
              className="text-lg md:text-sm flex-grow justify-start gap-3 h-auto py-3" // flex-grow to take available space
              onClick={() => handleActionClick('closestRest')}
            >
              <MapPin className="w-4 h-4" />
              가장 가까운 무더위 쉼터
            </Button>
            <select
              id="mobileFacilityType"
              name="mobileFacilityType"
              className="block w-auto pl-3 pr-5 py-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md" // Removed mt-2, w-full, changed to w-auto
              value={selectedFacilityType}
              onChange={(e) => setSelectedFacilityType(e.target.value)}
            >
              <option value="">모두</option>
              <option value="공공시설">공공시설</option>
              <option value="특정계층이용시설">특정계층이용시설</option>
            </select>
          </div>
          <Button
            variant="ghost"
            className="text-lg md:text-sm w-full justify-start gap-3 h-auto py-3"
            onClick={() => handleActionClick('help')}
          >
            <Info className="w-4 h-4" />
            도움말
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

export { MobileMenu }; // Export MobileMenu
