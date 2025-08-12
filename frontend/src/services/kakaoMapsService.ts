export const fetchRegionName = async (lat: number, lng: number) => {
  const res = await fetch(
    `/api/kakao-proxy?lat=${lat}&lng=${lng}`
  );
  console.log("kakao")
  if (!res.ok) throw new Error('Failed to fetch region name from proxy');
  const data = await res.json();
  return data.documents?.[0]?.address_name;
};
