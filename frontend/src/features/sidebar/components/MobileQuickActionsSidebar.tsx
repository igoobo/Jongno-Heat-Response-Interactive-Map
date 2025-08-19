import QuickActions from './QuickActions';
import { SlideInPanel } from '../../../components/SlideInPanel'; // New import

interface MobileQuickActionsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileQuickActionsSidebar: React.FC<MobileQuickActionsSidebarProps> = ({ isOpen, onClose }) => {
  return (
    <SlideInPanel
      isOpen={isOpen}
      onClose={onClose}
      animationStyle={{
        maxHeight: 'calc(100vh - 4rem)', // 4rem (64px) is the height of MobileBottomNav
        bottom: isOpen ? '4rem' : '-100%', // Move off-screen when closed
      }}
      containerClassName="p-4 shadow-lg rounded-t-lg" // Apply rounded-t-lg here
    >
      <div className="mt-4 space-y-4 overflow-y-auto pb-4">
        <QuickActions />
      </div>
    </SlideInPanel>
  );
};

export default MobileQuickActionsSidebar;