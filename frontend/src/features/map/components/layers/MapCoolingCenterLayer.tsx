import { useEffect, useRef } from 'react';

interface MapCoolingCenterLayerProps {
  map: any;
  layerStates: any;
  onLoad: () => void;
}

export const MapCoolingCenterLayer: React.FC<MapCoolingCenterLayerProps> = ({
  map,
  layerStates,
  onLoad,
}) => {
  const markersRef = useRef<any[]>([]);
  const openInfoWindowRef = useRef<any>(null);
  const fixedInfoWindowRef = useRef<any>(null);

  const loadCoolingCenters = async () => {
    try {
      const response = await fetch('/seoul_jongno_rest.json');
      if (!response.ok) throw new Error('Failed to load cooling center data.');

      const data = await response.json();

      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      data.DATA.forEach((item: any) => {
        const lat = item.lat;
        const lng = item.lon;
        const title = item.r_area_nm;

        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(lat, lng),
          title,
          map: layerStates.coolingCenter ? map : null,
        });

        const facilityIcon = item.facility_type1 === '공공시설' ? '🏛'
          : item.facility_type1 === '교육시설' ? '🏫'
          : item.facility_type1 === '복지시설' ? '🏥'
          : item.facility_type1 === '민간시설' ? '🏢'
          : '🧊';

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

        window.kakao.maps.event.addListener(marker, 'mouseover', () => {
          if (fixedInfoWindowRef.current !== infowindow) {
            infowindow.open(map, marker);
            openInfoWindowRef.current = infowindow;
          }
        });

        window.kakao.maps.event.addListener(marker, 'mouseout', () => {
          if (fixedInfoWindowRef.current !== infowindow) {
            infowindow.close();
            openInfoWindowRef.current = null;
          }
        });

        window.kakao.maps.event.addListener(marker, 'click', () => {
          if (fixedInfoWindowRef.current && fixedInfoWindowRef.current !== infowindow) {
            fixedInfoWindowRef.current.close();
          }

          infowindow.open(map, marker);
          fixedInfoWindowRef.current = infowindow;

          setTimeout(() => {
            const closeBtn = document.getElementById(`close-info-${title}`);
            if (closeBtn) {
              closeBtn.addEventListener('click', () => {
                infowindow.close();
                fixedInfoWindowRef.current = null;
              });
            }
          }, 0);
        });

        markersRef.current.push(marker);
      });
      onLoad(); // Call onLoad after all markers are processed
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (map) {
      loadCoolingCenters();
      onLoad();
    }
  }, [map]);

  useEffect(() => {
    if (!map || markersRef.current.length === 0) return;

    if (!layerStates.coolingCenter) {
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
      marker.setMap(layerStates.coolingCenter ? map : null);
    });
  }, [layerStates.coolingCenter, map]);

  useEffect(() => {
    if (map) {
      const handleClick = () => {
        if (fixedInfoWindowRef.current) {
          fixedInfoWindowRef.current.close();
          fixedInfoWindowRef.current = null;
        }
      };
      window.kakao.maps.event.addListener(map, 'click', handleClick);
      return () => {
        window.kakao.maps.event.removeListener(map, 'click', handleClick);
      };
    }
  }, [map]);

  return null;
};
