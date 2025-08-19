import LocationInfo from './LocationInfo';
import { SlideInPanel } from '../../../components/SlideInPanel'; // New import

interface MobileLocationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileLocationSidebar: React.FC<MobileLocationSidebarProps> = ({ isOpen, onClose }) => {
  return (
    <SlideInPanel
      isOpen={isOpen}
      onClose={onClose}
      animationStyle={{
        bottom: '4rem', // Fixed position above the bottom nav
        maxHeight: isOpen ? 'calc(100vh - 4rem)' : '0', // Animate height
        overflow: 'hidden', // Hide content when collapsed
      }}
      containerClassName="rounded-t-lg" // Apply rounded-t-lg here
    >
      <div className="mt-4 space-y-4 overflow-y-auto pb-4">
        <LocationInfo />
      </div>
    </SlideInPanel>
  );
};

export default MobileLocationSidebar;