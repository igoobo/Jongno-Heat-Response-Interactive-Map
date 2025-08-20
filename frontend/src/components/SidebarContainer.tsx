import React, { useState } from 'react';
import { DesktopSidebar } from '../features/sidebar/components/DesktopSidebar';
import { MobileSidebar } from '../features/sidebar/components/MobileSidebar';

type SidebarTab = 'info' | 'layers' | 'heat-illness' | 'chat';

interface SidebarContainerProps {
  isDesktop: boolean;
  map: any; // Consider a more specific type if available
}

export const SidebarContainer: React.FC<SidebarContainerProps> = ({ isDesktop, map }) => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('info');

  const sidebarWidthClass = activeTab === 'chat' ? 'w-[900px]' : 'w-[450px]'; // Adjust width as needed

  return (
    <>
      {isDesktop ? (
        <div className={`h-64 md:h-full md:flex-shrink-0 md:flex md:flex-col ${sidebarWidthClass}`}>
          <DesktopSidebar map={map} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      ) : (
        <MobileSidebar />
      )}
    </>
  );
};
