import React from 'react';
import { DesktopSidebarHeader } from './DesktopSidebarHeader';
import { DesktopSidebarTabs } from './DesktopSidebarTabs';
import { DesktopSidebarContent } from './DesktopSidebarContent';
import { DesktopSidebarFooter } from './DesktopSidebarFooter';

type SidebarTab = 'info' | 'layers' | 'heat-illness' | 'chat';

interface DesktopSidebarProps {
  map: any; // Accept map prop
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ map, activeTab, setActiveTab }) => {
  return (
    <div className="hidden md:flex h-full bg-gray-50 border-l border-border shadow-lg z-150">
      <DesktopSidebarTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="w-full h-full bg-white flex flex-col relative">
        <DesktopSidebarHeader />
        <div className="absolute top-24 right-0 w-full ">
          <DesktopSidebarContent activeTab={activeTab} map={map} />
        </div>
        <DesktopSidebarFooter />
      </div>
    </div>
  );
};