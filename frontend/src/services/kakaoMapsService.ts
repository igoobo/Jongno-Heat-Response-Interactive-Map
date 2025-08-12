export const fetchRegionName = async (lat: number, lng: number) => {
  const res = await fetch(
    `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lng}&y=${lat}`,
    {
      headers: {
        Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`,
      },
    }
  );
  console.log("kakao")
  const data = await res.json();
  return data.documents?.[0]?.address_name;
};
