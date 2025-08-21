import { useEffect, useRef, useState } from 'react'; // Import useState
import { apiClient } from '../../../apiClient';
import { useCenterMarker } from '../../../context/CenterMarkerContext'; // Import the new hook
import { useCoolingCenterMarkerInitialization } from './useCoolingCenterMarkerInitialization'; // New import

export const useCoolingCenters = (map: any, layerStates: any, onLoad: any) => {
  const markersRef = useRef<any[]>([]);
  const openInfoWindowRef = useRef<any>(null);
  const fixedInfoWindowRef = useRef<any>(null);
  const { setCenterMarkerVisible } = useCenterMarker(); // Consume the context
  const [coolingCenterData, setCoolingCenterData] = useState<any>(null); // State to store fetched data

  const fetchCoolingCenterData = async () => {
    return apiClient<any>('/api/cooling-centers');
  };

  useEffect(() => {
    if (!map || !window.kakao) return;

    const loadDataAndInitialize = async () => {
      try {
        const data = await fetchCoolingCenterData();
        setCoolingCenterData(data); // Set the fetched data to state
      } catch (error) {
        console.error(error);
      } finally {
        onLoad();
      }
    };

    loadDataAndInitialize();
  }, [map, layerStates.coolingCenter]);

  // Call the hook at the top level, passing data when available
  useCoolingCenterMarkerInitialization({
    map,
    layerStates,
    markersRef,
    openInfoWindowRef,
    fixedInfoWindowRef,
    setCenterMarkerVisible,
    data: coolingCenterData, // Pass the state variable
  });

  return { markersRef, openInfoWindowRef, fixedInfoWindowRef };
};
