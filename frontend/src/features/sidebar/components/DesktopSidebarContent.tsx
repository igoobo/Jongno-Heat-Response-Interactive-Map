import * as React from 'react';
import LocationInfo from './LocationInfo';
import WeatherCard from '../../weather/components/WeatherCard';
import HourlyForecastChart from '../../weather/components/HourlyForecastChart';
import MapLayers from './MapLayers';
import QuickActions from '././QuickActions';
import { SidebarPanel } from './SidebarPanel';
import { ClosestCoolingCenterCard } from './ClosestCoolingCenterCard'; // Import the new component
import { HeatIllnessGuide } from './heat-illness-guide/HeatIllnessGuide';
import { ChatInterface } from './chat-sidebar/ChatInterface';

interface DesktopSidebarContentProps {
  activeTab: 'info' | 'layers' | 'heat-illness' | 'chat';
  map: any; // Accept map prop
}

export const DesktopSidebarContent: React.FC<DesktopSidebarContentProps> = ({ activeTab, map }) => { // Destructure map prop
  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4">
      <SidebarPanel isActive={activeTab === 'info'} className="space-y-8 bg-white">
        <LocationInfo />
        <WeatherCard />
        <HourlyForecastChart />
      </SidebarPanel>
      <SidebarPanel isActive={activeTab === 'layers'} className="space-y-4 bg-white">
        {/* New Card for Closest Cooling Center */}
        <ClosestCoolingCenterCard map={map} /> {/* Render the new component */}
        <MapLayers />
        <QuickActions />
      </SidebarPanel>
      <SidebarPanel isActive={activeTab === 'heat-illness'} className="space-y-4 bg-white">
        <HeatIllnessGuide />
      </SidebarPanel>
      <SidebarPanel isActive={activeTab === 'chat'} className="space-y-4 bg-white">
        <ChatInterface />
      </SidebarPanel>
    </div>
  );
};