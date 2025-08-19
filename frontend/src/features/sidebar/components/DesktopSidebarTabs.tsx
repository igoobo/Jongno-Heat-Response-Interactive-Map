import * as React from 'react';
import { SIDEBAR_TABS } from '../constants/sidebarTabs'; // Import the new constant

interface DesktopSidebarTabsProps {
  activeTab: 'info' | 'layers' | 'heat-illness';
  setActiveTab: (tab: 'info' | 'layers' | 'heat-illness') => void;
}

export const DesktopSidebarTabs: React.FC<DesktopSidebarTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-col gap-2 p-2 bg-white border-r border-border">
      {SIDEBAR_TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as any)} // Cast to any for now due to strict type
          className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors duration-200 ${activeTab === tab.id ? 'bg-primary text-primary-foreground shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
          title={tab.title}
        >
          <tab.icon className="w-5 h-5" />
        </button>
      ))}
    </div>
  );
};