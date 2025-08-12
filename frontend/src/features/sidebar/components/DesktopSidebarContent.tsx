import * as React from 'react';
import { useState } from 'react'; // Import useState
import LocationInfo from './LocationInfo';
import WeatherCard from '../../weather/components/WeatherCard';
import HourlyForecastChart from '../../weather/components/HourlyForecastChart';
import MapLayers from './MapLayers';
import QuickActions from '././QuickActions';
import { SidebarPanel } from './SidebarPanel';
import { useCurrentLocation } from '../../../hooks/useCurrentLocation'; // Import useCurrentLocation
import { toast } from 'react-toastify'; // Import toast
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card'; // Import Card components
import { Button } from '../../../components/ui/button'; // Import Button

interface DesktopSidebarContentProps {
  activeTab: 'info' | 'layers';
  map: any; // Accept map prop
}

export const DesktopSidebarContent: React.FC<DesktopSidebarContentProps> = ({ activeTab, map }) => { // Destructure map prop
  const { position, error, getLocation } = useCurrentLocation(); // Use position instead of location
  const [closestCenter, setClosestCenter] = useState<any>(null); // State to store closest center

  const findClosestCoolingCenter = async () => {
    // Trigger location fetch if not already initiated
    if (!position && !error) { // If no position and no error, try to get location
      getLocation(map); // Pass map to getLocation
      toast.info("위치 정보를 불러오는 중입니다...");
      return;
    }
    if (error) {
      toast.error("위치 정보를 불러올 수 없습니다. 브라우저 설정에서 위치 권한을 허용해주세요.");
      return;
    }
    if (!position) { // If position is still null after trying to get it
      toast.error("현재 위치를 알 수 없습니다.");
      return;
    }

    try {
      const response = await fetch(`/api/closest-cooling-center?lat=${position.lat}&lng=${position.lng}`);
      if (!response.ok) {
        throw new Error('Failed to fetch closest cooling center');
      }
      const data = await response.json();
      setClosestCenter(data);
      toast.success("가장 가까운 무더위 쉼터를 찾았습니다!");

      // Move map to the closest center
      if (map && data.lat && data.lon) { // Check if map and coordinates exist
        const moveLatLon = new window.kakao.maps.LatLng(parseFloat(data.lat), parseFloat(data.lon));
        map.panTo(moveLatLon);
      }
    } catch (err) {
      console.error("Error fetching closest cooling center:", err);
      toast.error("무더위 쉼터를 찾는 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4">
      <SidebarPanel isActive={activeTab === 'info'} className="space-y-8 bg-white">
        <LocationInfo />
        <WeatherCard />
        <HourlyForecastChart />
      </SidebarPanel>
      <SidebarPanel isActive={activeTab === 'layers'} className="space-y-8 bg-white">
        {/* New Card for Closest Cooling Center */}
        <Card>
          <CardHeader>
            <CardTitle>가장 가까운 무더위 쉼터 찾기</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={findClosestCoolingCenter} className="w-full">
              현재 위치에서 찾기
            </Button>
            {closestCenter && (
              <div className="mt-4 text-sm">
                <p><strong>쉼터명:</strong> {closestCenter.r_area_nm}</p>
                <p><strong>주소:</strong> {closestCenter.r_detl_add}</p>
                <p><strong>거리:</strong> {closestCenter.distance_km} km</p>
                {/* Add more details as needed */}
              </div>
            )}
          </CardContent>
        </Card>
        <MapLayers />
        <QuickActions />
      </SidebarPanel>
    </div>
  );
};