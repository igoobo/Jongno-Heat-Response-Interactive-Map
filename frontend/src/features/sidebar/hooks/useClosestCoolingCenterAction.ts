import { useState } from 'react';
import { toast } from 'react-toastify';
import type { LayerStates } from '../../../context/MapLayerContext'; // Import LayerStates

interface UseClosestCoolingCenterActionProps {
  map: any;
  setLayerState: (layerId: keyof LayerStates, value: boolean) => void;
  onClose: () => void;
}

export const useClosestCoolingCenterAction = ({
  map,
  setLayerState,
  onClose,
}: UseClosestCoolingCenterActionProps) => {
  const [selectedFacilityType, setSelectedFacilityType] = useState<string>('');

  const handleClosestRestAction = async () => {
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
      if (map && data.lat && data.lon) {
        if (window.kakao && window.kakao.maps) {
          const moveLatLon = new window.kakao.maps.LatLng(parseFloat(data.lat), parseFloat(data.lon));
          setTimeout(() => {
            map.panTo(moveLatLon);
          }, 500);
        }
      }
      setLayerState('coolingCenter', true); // Enable coolingCenter layer
      toast.success("지도 중심에서 가장 가까운 무더위 쉼터로 이동했습니다!");
    } catch (err) {
      console.error("Error fetching closest cooling center:", err);
      toast.error("무더위 쉼터를 찾는 중 오류가 발생했습니다.");
    } finally {
      onClose(); // Close the menu after an action is performed
    }
  };

  return { selectedFacilityType, setSelectedFacilityType, handleClosestRestAction };
};