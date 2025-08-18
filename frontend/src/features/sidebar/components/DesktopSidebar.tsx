import { useState } from 'react';
import { DesktopSidebarHeader } from './DesktopSidebarHeader';
import { DesktopSidebarTabs } from './DesktopSidebarTabs';
import { DesktopSidebarContent } from './DesktopSidebarContent';
import { DesktopSidebarFooter } from './DesktopSidebarFooter';

type SidebarTab = 'info' | 'layers' | 'heat-illness' | 'chat';

interface DesktopSidebarProps {
  map: any; // Accept map prop
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ map }) => { // Destructure map prop
  const [activeTab, setActiveTab] = useState<SidebarTab>('info');

  return (
    <div className="hidden md:flex h-full bg-gray-50 border-l border-border shadow-lg">
      <DesktopSidebarTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="w-full h-full bg-white flex flex-col">
        <DesktopSidebarHeader />
        <div className="absolute top-24 right-0 w-110 z-40 ">
          <DesktopSidebarContent activeTab={activeTab} map={map} /> {/* Pass map prop */}
        </div>
        <DesktopSidebarFooter />
      </div>
    </div>
  );
};