import React from 'react';
import { DesktopSidebar } from '../features/sidebar/components/DesktopSidebar';
import { MobileSidebar } from '../features/sidebar/components/MobileSidebar';

interface SidebarContainerProps {
  isDesktop: boolean;
  map: any; // Consider a more specific type if available
}

export const SidebarContainer: React.FC<SidebarContainerProps> = ({ isDesktop, map }) => {
  return (
    <>
      {isDesktop ? (
        <div className="h-64 md:h-full md:flex-shrink-0 md:flex md:flex-col">
          <DesktopSidebar map={map} />
        </div>
      ) : (
        <MobileSidebar />
      )}
    </>
  );
};
