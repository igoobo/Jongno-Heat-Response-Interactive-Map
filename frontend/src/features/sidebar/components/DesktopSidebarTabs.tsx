import { MapPin, Layers } from 'lucide-react';
import * as React from 'react';

interface DesktopSidebarTabsProps {
  activeTab: 'info' | 'layers';
  setActiveTab: (tab: 'info' | 'layers') => void;
}

export const DesktopSidebarTabs: React.FC<DesktopSidebarTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-col gap-2 p-2 bg-white border-r border-border">
      <button
        onClick={() => setActiveTab('info')}
        className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors duration-200 ${activeTab === 'info' ? 'bg-primary text-primary-foreground shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
        title="Info"
      >
        <MapPin className="w-5 h-5" />
      </button>
      <button
        onClick={() => setActiveTab('layers')}
        className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors duration-200 ${activeTab === 'layers' ? 'bg-primary text-primary-foreground shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
        title="Layers"
      >
        <Layers className="w-5 h-5" />
      </button>
    </div>
  );
};