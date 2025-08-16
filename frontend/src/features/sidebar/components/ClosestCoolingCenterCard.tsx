import * as React from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';

interface ClosestCoolingCenterCardProps {
  map: any;
}

export const ClosestCoolingCenterCard: React.FC<ClosestCoolingCenterCardProps> = ({ map }) => {
  const [closestCenter, setClosestCenter] = useState<any>(null);
  const [selectedFacilityType, setSelectedFacilityType] = useState<string>('');

  const findClosestCoolingCenter = async () => {
    if (!map) return;

    const center = map.getCenter();
    const currentPosition = {
      lat: center.getLat(),
      lng: center.getLng(),
    };

    try {
      let url = `/api/closest-cooling-center?lat=${currentPosition.lat}&lng=${currentPosition.lng}`;
      if (selectedFacilityType) {
        url += `&facility_type1=${selectedFacilityType}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch closest cooling center');
      }
      const data = await response.json();
      setClosestCenter(data);
      toast.success("지도 중심에서 가장 가까운 무더위 쉼터를 찾았습니다!");

      if (map && data.lat && data.lon) {
        if (window.kakao && window.kakao.maps) {
          const moveLatLon = new window.kakao.maps.LatLng(parseFloat(data.lat), parseFloat(data.lon));
          setTimeout(() => {
            map.panTo(moveLatLon);
          }, 500);
        }
      } 
    } catch (err) {
      console.error("Error fetching closest cooling center:", err);
      toast.error("무더위 쉼터를 찾는 중 오류가 발생했습니다.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>가장 가까운 무더위 쉼터 찾기</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <label htmlFor="facilityType" className="block text-sm font-medium text-gray-700 mb-1">시설 유형:</label>
          <select
            id="facilityType"
            name="facilityType"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={selectedFacilityType}
            onChange={(e) => setSelectedFacilityType(e.target.value)}
          >
            <option value="">모두</option>
            <option value="공공시설">공공시설</option>
            <option value="특정계층이용시설">특정계층이용시설</option>
          </select>
        </div>
        <Button onClick={findClosestCoolingCenter} className="w-full">
          현재 위치에서 찾기
        </Button>
        {closestCenter && (
          <div className="mt-4 text-sm">
            <p><strong>쉼터명:</strong> {closestCenter.r_area_nm}</p>
            <p><strong>주소:</strong> {closestCenter.r_detl_add}</p>
            <p><strong>거리:</strong> {closestCenter.distance_km} km</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
