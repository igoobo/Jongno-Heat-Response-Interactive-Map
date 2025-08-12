// src/components/controllers/moveToFullView.ts

export const moveToFullView = (map: any) => {
  if (!map || !window.kakao) return;

  const { LatLng } = window.kakao.maps;

  // 종로구 중심 좌표
  const center = new LatLng(37.591059, 126.9899);

  map.setCenter(center);
  map.setLevel(6); // 여기서 숫자를 1~5 사이로 바꿔서 더 확대/축소 가능
};
