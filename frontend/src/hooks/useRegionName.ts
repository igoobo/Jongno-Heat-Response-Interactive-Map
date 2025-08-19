import { useEffect, useState } from 'react';
import { fetchRegionName } from '../services/kakaoMapsService'; // Assuming this path is correct

interface UseRegionNameProps {
  location: { lat: number; lng: number };
}

export const useRegionName = ({ location }: UseRegionNameProps) => {
  const [regionName, setRegionName] = useState('');

  useEffect(() => {
    const getRegionName = async () => {
      if (location.lat && location.lng) {
        const name = await fetchRegionName(location.lat, location.lng);
        setRegionName(name);
      }
    };
    getRegionName();
  }, [location]);

  return regionName;
};
