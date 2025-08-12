export const moveToCurrentLocation = (map: any, lat: number, lng: number) => {
  console.log("📍 moveToCurrentLocation 진입", lat, lng);

  if (!map || !window.kakao?.maps) {
    console.warn("🚫 지도 객체 없음");
    return;
  }

  const center = new window.kakao.maps.LatLng(lat, lng);
  map.setLevel(3);
  map.panTo(center);

};
