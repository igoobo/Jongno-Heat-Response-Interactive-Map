import * as React from 'react';
import LocationInfo from './LocationInfo';
import WeatherCard from '../../weather/components/WeatherCard';
import HourlyForecastChart from '../../weather/components/HourlyForecastChart';
import MapLayers from './MapLayers';
import QuickActions from './QuickActions';
import { SidebarPanel } from './SidebarPanel';

interface DesktopSidebarContentProps {
  activeTab: 'info' | 'layers';
}

export const DesktopSidebarContent: React.FC<DesktopSidebarContentProps> = ({ activeTab }) => {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4">
      <SidebarPanel isActive={activeTab === 'info'} className="space-y-8 bg-white">
        <LocationInfo />
        <WeatherCard />
        <HourlyForecastChart />
      </SidebarPanel>
      <SidebarPanel isActive={activeTab === 'layers'} className="space-y-8 bg-white">
        <MapLayers />
        <QuickActions />
      </SidebarPanel>
    </div>
  );
};