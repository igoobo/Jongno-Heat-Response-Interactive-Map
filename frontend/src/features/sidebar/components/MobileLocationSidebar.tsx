import { X } from 'lucide-react';
import LocationInfo from './LocationInfo';

interface MobileLocationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileLocationSidebar: React.FC<MobileLocationSidebarProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`
        fixed left-0 w-full bg-white rounded-t-lg z-50
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
      <div className="mt-4 space-y-4 overflow-y-auto pb-4">
        <LocationInfo />
      </div>
    </div>
  );
};

export default MobileLocationSidebar;
