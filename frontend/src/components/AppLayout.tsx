import React from 'react';
import { SidebarContainer } from './SidebarContainer'; // New import

interface AppLayoutProps {
  isDesktop: boolean;
  map: any; // Consider a more specific type if available
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ isDesktop, map, children }) => {
  return (
    <div className="h-screen w-full bg-background flex flex-col md:flex-row overflow-hidden">
      <div className="flex-1 p-3 md:p-6">
        <div className="h-full w-full ">
          {children}
        </div>
      </div>
      <SidebarContainer isDesktop={isDesktop} map={map} />
    </div>
  );
};
