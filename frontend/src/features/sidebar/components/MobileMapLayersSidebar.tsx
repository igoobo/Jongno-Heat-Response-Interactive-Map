import { X } from 'lucide-react';
import MapLayers from './MapLayers';

interface MobileMapLayersSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMapLayersSidebar: React.FC<MobileMapLayersSidebarProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`
        fixed left-0 w-full bg-white p-4 shadow-lg rounded-t-lg z-50
        transition-all duration-300 ease-out
      `}
      style={{
        maxHeight: 'calc(100vh - 4rem)', // 4rem (64px) is the height of MobileBottomNav
        bottom: isOpen ? '4rem' : '-100%', // Move off-screen when closed
      }}
    >
      <div className="flex justify-end">
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>
      <div className="mt-4 space-y-4 overflow-y-auto pb-4">
        <MapLayers />
      </div>
    </div>
  );
};

export default MobileMapLayersSidebar;
