import { useEffect, useRef, useState } from 'react';
import { useMapLocation } from '../context/MapLocationContext';
import { useDebouncedCallback } from '../hooks/useDebouncedCallback';
import KakaoMapLicense from './KakaoMapLicense';
import { useMapLayer } from '../context/MapLayerContext';
import { fetchHourlyForecast } from '../lib/weatherUtils';
import {TemperatureLegend} from './TemperatureLegend';
import {TemperatureSlider} from './TemperatureSlider';
import LoadingOverlay from './LoadingOverlay';

declare global {
  interface Window {
    kakao: any;
  }
}

const KakaoMap: React.FC = () => {
  const { layerStates } = useMapLayer(); // ✅ Context에서 직접 가져옴
  const { setLocation } = useMapLocation();
  const debouncedSetLocation = useDebouncedCallback(setLocation, 300);
  const [loading, setLoading] = useState(true);
  
  const mapRef = useRef<any>(null);
  const idleHandlerRef = useRef<(() => void) | null>(null);
  const polygonsRef = useRef<any[]>([]); // ✅ 폴리곤 객체 저장용
  const markersRef = useRef<any[]>([]); // ✅ 마커 저장용

  const openInfoWindowRef = useRef<any>(null);     // 현재 열린 인포윈도우
  const fixedInfoWindowRef = useRef<any>(null);    // 고정된 인포윈도우

  const polygonCentersRef = useRef<{ polygon: any; centerLat: number; centerLon: number }[]>([]);
  const [tempsByPolygon, setTempsByPolygon] = useState<number[][]>([]);
  const [hourIndex, setHourIndex] = useState(0)

  // 중심점 기반 온도 불러오기
  const loadTemperatureData = async () => {
    const temps: number[][] = [];

    for (const { centerLat, centerLon } of polygonCentersRef.current) {
      const hourlyTemps = await fetchHourlyForecast(centerLat, centerLon);
      temps.push(hourlyTemps);
    }

    setTempsByPolygon(temps);
  };
  function getColorByTemperature(temp: number): string {
    if (temp >= 30) return '#ff4c4c';
    if (temp >= 25) return '#ffb84c';
    if (temp >= 20) return '#ffff66';
    if (temp >= 15) return '#66cc66';
    return '#66b2ff';
  }

  const loadScript = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.getElementById('kakao-map-script')) {
          resolve();
          return;
        }

        const KAKAO_MAP_KEY = import.meta.env.VITE_KAKAO_MAP_JS_API_KEY;
        const script = document.createElement('script');
        script.id = 'kakao-map-script';
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&autoload=false`;
        script.onload = () => resolve();
        script.onerror = () => reject('카카오 지도 스크립트 로드 실패');
        document.head.appendChild(script);
      });
    };

  const loadGeoJSON = async () => {
      const response = await fetch('/jongno_wgs84.geojson');
      if (!response.ok) throw new Error('GeoJSON 파일을 불러오지 못했습니다.');
      return await response.json();
    };

   // 무더위 쉼터 마커 로드
    const loadCoolingCenters = async () => {
      try {
        const response = await fetch('/seoul_jongno_rest.json');
        if (!response.ok) throw new Error('쉼터 데이터 로드 실패');

        const data = await response.json();

        // // 마커 생성 함수
        // const createMarker = (lat: number, lng: number, title: string) => {
        //   const marker = new window.kakao.maps.Marker({
        //     position: new window.kakao.maps.LatLng(lat, lng),
        //     title,
        //     map: layerStates.coolingCenter ? mapRef.current : null, // 초깃값: 활성화 상태 반영
        //   });
        //   return marker;
        // };

        // 기존 마커 있으면 삭제
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        // DATA 배열 순회하며 마커 생성
        data.DATA.forEach((item: any) => {
          const lat = item.lat;
          const lng = item.lon;
          const title = item.r_area_nm;
          const address = item.r_detl_add;

          const marker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(lat, lng),
            title,
            map: layerStates.coolingCenter ? mapRef.current : null,
          });
        
        const facilityIcon = item.facility_type1 === '공공시설' ? '🏛'
          : item.facility_type1 === '교육시설' ? '🏫'
          : item.facility_type1 === '복지시설' ? '🏥'
          : item.facility_type1 === '민간시설' ? '🏢'
          : '🧊'; // 기본
        
        const infowindow = new window.kakao.maps.InfoWindow({
          content: `
            <div style="padding: 10px 12px; background: white; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.3); position: relative; min-width: 180px;">
              <div style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">${item.r_area_nm}</div>
              <div style="font-size: 12px; color: gray; margin-bottom: 6px;">${item.r_detl_add}</div>
              <div style="font-size: 13px; display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                <span>${facilityIcon}</span>
                <span>${item.facility_type1 || '시설 미분류'}</span>
              </div>
              <div style="font-size: 12px; color: #333;">👥 수용 인원: ${item.use_prnb || '정보 없음'}명</div>
              <div style="padding: 10px;">
                <a href="https://map.kakao.com/link/to/${encodeURIComponent(item.r_area_nm)},${lat},${lng}" 
                  target="_blank"
                  rel="noopener noreferrer"
                  style="color: #007bff; text-decoration: underline; font-size: 13px;">
                  📍 길찾기 (카카오맵)
                </a>
              </div>
              <button id="close-info-${item.r_area_nm}" style="position: absolute; top: 4px; right: 4px; border: none; background: transparent; cursor: pointer;">❌</button>
            </div>
          `,
          removable: false,
        });


          // Hover 이벤트
          window.kakao.maps.event.addListener(marker, 'mouseover', () => {
            if (fixedInfoWindowRef.current !== infowindow) {
              infowindow.open(mapRef.current, marker);
              openInfoWindowRef.current = infowindow;
            }
          });

          // Mouseout 이벤트
          window.kakao.maps.event.addListener(marker, 'mouseout', () => {
            if (fixedInfoWindowRef.current !== infowindow) {
              infowindow.close();
              openInfoWindowRef.current = null;
            }
          });

          // Click 이벤트 - 고정
          window.kakao.maps.event.addListener(marker, 'click', () => {
            // 기존 고정 인포윈도우 닫기
            if (fixedInfoWindowRef.current && fixedInfoWindowRef.current !== infowindow) {
              fixedInfoWindowRef.current.close();
            }

            infowindow.open(mapRef.current, marker);
            fixedInfoWindowRef.current = infowindow;

            // 닫기 버튼 이벤트 연결
            setTimeout(() => {
              const closeBtn = document.getElementById(`close-info-${title}`);
              if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                  infowindow.close();
                  fixedInfoWindowRef.current = null;
                });
              }
            }, 0); // DOM 렌더링 후 실행
          });

          markersRef.current.push(marker);
        });

        
      } catch (error) {
        console.error(error);
      }
    };

  // 중심 좌표 계산 함수
    function calculateCentroid(coords: number[][]): { lat: number; lon: number } {
      const lats = coords.map(([lon, lat]) => lat);
      const lons = coords.map(([lon, lat]) => lon);

      const avgLat = lats.reduce((sum, val) => sum + val, 0) / lats.length;
      const avgLon = lons.reduce((sum, val) => sum + val, 0) / lons.length;

      return { lat: avgLat, lon: avgLon };
    }
  const initMap = async () => {
      if (mapRef.current) return;
      if (!window.kakao || !window.kakao.maps) return;

      console.log("initMap 진입");

      return new Promise<void>((resolve, reject) => {
      window.kakao.maps.load(async () => {
        const container = document.getElementById('map');
        if (!container) {
          reject('map container not found');
          return;
        }

        const options = {
          center: new window.kakao.maps.LatLng(37.57582459848882, 126.97581958500346),
          level: 3,
        };

        const map = new window.kakao.maps.Map(container, options);
        mapRef.current = map;
        console.log("지도 생성 완료");

        try {
          const geojson = await loadGeoJSON();
          console.log("GeoJSON 로드 완료");

          const polygonCenters: { polygon: any; centerLat: number; centerLon: number }[] = [];

          geojson.features.forEach((feature: any) => {
            const coords = feature.geometry.coordinates[0];
            const path = coords.map(([lon, lat]: number[]) => new window.kakao.maps.LatLng(lat, lon));

            const polygon = new window.kakao.maps.Polygon({
              map: layerStates.area ? map : null, // ✅ 초기 활성화 상태 반영
              path,
              strokeWeight: 2,
              strokeColor: '#004c80',
              strokeOpacity: 0.8,
              fillColor: '#ffffff',
              fillOpacity: 0.5,
            });
            
           const { lat, lon } = calculateCentroid(coords);
            polygonCentersRef.current.push({ polygon, centerLat: lat, centerLon: lon });
             polygonsRef.current.push(polygon);


             
            // 마우스 오버 이벤트
            window.kakao.maps.event.addListener(polygon, 'mouseover', () => {
              polygon.setOptions({ fillColor: '#09f' });
            });

            window.kakao.maps.event.addListener(polygon, 'mouseout', () => {
              polygon.setOptions({ fillColor: '#ffffff' });
            });

            polygonsRef.current.push(polygon); // ✅ 폴리곤 저장
          });

          await loadTemperatureData();
          console.log("온도 데이터 로드 완료");

          await loadCoolingCenters();
          console.log("쉼터 마커 로드 완료");

          const handleIdle = () => {
          const center = map.getCenter();
          const level = map.getLevel();
          debouncedSetLocation({
            lat: center.getLat(),
            lng: center.getLng(),
            zoom: level,
          });
        };

        idleHandlerRef.current = handleIdle;
        window.kakao.maps.event.addListener(map, 'idle', handleIdle);

        window.kakao.maps.event.addListener(map, 'click', () => {
          if (fixedInfoWindowRef.current) {
            fixedInfoWindowRef.current.close();
            fixedInfoWindowRef.current = null;
          }
        });

         resolve(); // ✅ 최종 완료
        } catch (err) {
          console.error("초기화 실패", err);
          reject(err);
        }
        // 온도 데이터 로드
        
        
      });
    });
  };

    

    useEffect(() => {
      

      const loadEverything = async () => {
      try {
        console.log('스크립트 로드 시작');
        await loadScript();
        console.log('스크립트 로드 완료');
        await initMap();
        console.log('지도 초기화 완료');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        console.log('loading false로 변경');
      }
    };

    loadEverything();


      
      
      return () => {
        if (mapRef.current && idleHandlerRef.current) {
          window.kakao.maps.event.removeListener(mapRef.current, 'idle', idleHandlerRef.current);
        }
      };

      
    }, []); // 최초 한 번 실행

  

  // ✅ area 상태가 변경되면 폴리곤 보이기/숨기기
  useEffect(() => {
    if (!mapRef.current || polygonsRef.current.length === 0) return;

    polygonsRef.current.forEach((polygon) => {
      polygon.setMap(layerStates.area ? mapRef.current : null);
    });


  }, [layerStates.area]); // ✅ area만 감시

  // coolingCenter 상태 변경 시 마커 보이기/숨기기
  useEffect(() => {
    if (!mapRef.current || markersRef.current.length === 0) return;
    
    if (!layerStates.coolingCenter) {
    // 현재 열려있는 인포윈도우들 닫기
    if (openInfoWindowRef.current) {
      openInfoWindowRef.current.close();
      openInfoWindowRef.current = null;
    }
    if (fixedInfoWindowRef.current) {
      fixedInfoWindowRef.current.close();
      fixedInfoWindowRef.current = null;
    }
  }

    markersRef.current.forEach(marker => {
      marker.setMap(layerStates.coolingCenter ? mapRef.current : null);
    });
  }, [layerStates.coolingCenter]);

  useEffect(() => {
    if (!layerStates.tempDist || tempsByPolygon.length === 0) return;
    
    polygonCentersRef.current.forEach(({ polygon }, index) => {
      const temp = tempsByPolygon[index][hourIndex];
      if (temp == null) return;

      const fillColor = getColorByTemperature(temp); // 온도 → 색상 함수
      polygon.setOptions({ fillColor });
    });
  }, [hourIndex, layerStates.tempDist, tempsByPolygon]);

  useEffect(() => {
    if (!mapRef.current || !polygonsRef.current.length) return;

    if (!layerStates.tempDist) {
      // 뱃지가 꺼졌을 때 → 색 초기화
      polygonsRef.current.forEach((polygon) => {
        polygon.setOptions({ fillColor: '#ffffff' }); // 초기 색상
      });
  }
}, [layerStates.tempDist]);


  
  
  return (
    <>
      {loading && <LoadingOverlay />}
      <div id="map" style={{ width: "100%", height: "100vh" }}></div>
      <KakaoMapLicense />

      {/* 슬라이더 컨테이너 */}
      {layerStates.tempDist && tempsByPolygon.length > 0 && (
        <>
          <TemperatureLegend />
          <TemperatureSlider
            hourIndex={hourIndex}
            max={tempsByPolygon[0].length - 1}
            onChange={(val) => setHourIndex(val)}
          />
        </>
      )}
    {/* 로딩 오버레이 */}
    
    </>
  );
};

export default KakaoMap;
