import { apiClient } from '../apiClient';

export const fetchRegionName = async (lat: number, lng: number) => {
  const data = await apiClient<any>(
    `/api/kakao-proxy?lat=${lat}&lng=${lng}`
  );
  console.log("kakao")
  return data.documents?.[0]?.address_name;
};