import { useEffect, useRef } from 'react';
import { useCenterMarker } from '../../../context/CenterMarkerContext'; // Import the new hook

export const useCoolingCenters = (map: any, layerStates: any, onLoad: any) => {
  const markersRef = useRef<any[]>([]);
  const openInfoWindowRef = useRef<any>(null);
  const fixedInfoWindowRef = useRef<any>(null);
  const { setCenterMarkerVisible } = useCenterMarker(); // Consume the context

  

  useEffect(() => {
    if (!map || !window.kakao) return;

    const initCoolingCenters = async () => {
      try {
        const response = await fetch('/api/cooling-centers');
        if (!response.ok) throw new Error('Failed to load cooling center data.');

        const data = await response.json();

        // Clear existing markers
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        data.DATA.forEach((item: any) => {
          const lat = item.lat;
          const lng = item.lon;
          const title = item.r_area_nm;

          const marker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(lat, lng),
            title,
            map: layerStates.coolingCenter ? map : null, // Set map based on layerStates
          });

          const facilityIcon = item.facility_type1 === '공공시설' ? '🏛'
            : item.facility_type1 === '교육시설' ? '🏫'
            : item.facility_type1 === '복지시설' ? '🏥'
            : item.facility_type1 === '민간시설' ? '🏢'
            : '🧊';

          const infowindow = new window.kakao.maps.InfoWindow({
                        content: `
              <style>
                .info-window-content {
                  padding: 12px 14px;
                  background: white;
                  border-radius: 8px;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                  position: relative;
                  min-width: 220px;
                }
                .info-window-title {
                  font-weight: bold;
                  font-size: 18px; /* Mobile */
                  margin-bottom: 6px;
                }
                .info-window-address, .info-window-capacity {
                  font-size: 14px; /* Mobile */
                  color: #555;
                  margin-bottom: 8px;
                }
                .info-window-type, .info-window-link {
                  font-size: 16px; /* Mobile */
                }
                .info-window-close-btn {
                  font-size: 18px; /* Mobile */
                }

                @media (min-width: 768px) { /* Desktop styles */
                  .info-window-content {
                    min-width: 250px; /* Slightly larger for desktop */
                  }
                  .info-window-title {
                    font-size: 14px; /* Desktop */
                  }
                  .info-window-address, .info-window-capacity {
                    font-size: 12px; /* Desktop */
                  }
                  .info-window-type, .info-window-link {
                    font-size: 13px; /* Desktop */
                  }
                  .info-window-close-btn {
                    font-size: 16px; /* Desktop */
                  }
                }
              </style>
              <div class="info-window-content">
                <div class="info-window-title">${item.r_area_nm}</div>
                <div class="info-window-address">${item.r_detl_add}</div>
                <div class="info-window-type flex items-center gap-8px mb-6px">
                  <span>${facilityIcon}</span>
                  <span>${item.facility_type1 || '시설 미분류'}</span>
                </div>
                <div class="info-window-capacity">👥 수용 인원: ${item.use_prnb || '정보 없음'}명</div>
                <div style="padding: 10px 0 0;">
                  <a href="https://map.kakao.com/link/to/${encodeURIComponent(item.r_area_nm)},${lat},${lng}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="info-window-link" style="color: #007bff; text-decoration: underline;">
                    📍 길찾기 (카카오맵)
                  </a>
                </div>
                <button id="close-info-${item.r_area_nm}" class="info-window-close-btn" style="position: absolute; top: 6px; right: 6px; border: none; background: transparent; cursor: pointer;">❌</button>
              </div>
            `,
            removable: false,
            zIndex: 20,
          });

          window.kakao.maps.event.addListener(marker, 'mouseover', () => {
            if (fixedInfoWindowRef.current !== infowindow) {
              infowindow.open(map, marker);
              openInfoWindowRef.current = infowindow;
              setCenterMarkerVisible(false); // Hide center marker on mouseover
            }
          });

          window.kakao.maps.event.addListener(marker, 'mouseout', () => {
            if (fixedInfoWindowRef.current !== infowindow) {
              infowindow.close();
              openInfoWindowRef.current = null;
              setCenterMarkerVisible(true); // Show center marker on mouseout
            }
          });

          window.kakao.maps.event.addListener(marker, 'click', () => {
            if (fixedInfoWindowRef.current && fixedInfoWindowRef.current !== infowindow) {
              fixedInfoWindowRef.current.close();
            }

            infowindow.open(map, marker);
            fixedInfoWindowRef.current = infowindow;
            setCenterMarkerVisible(false); // Hide center marker on click

            setTimeout(() => {
              const closeBtn = document.getElementById(`close-info-${title}`);
              if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                  infowindow.close();
                  fixedInfoWindowRef.current = null;
                  setCenterMarkerVisible(true); // Show center marker when infowindow is closed
                });
              }
            }, 0);
          });

          markersRef.current.push(marker);
        });
      } catch (error) {
        console.error(error);
      } finally {
        onLoad(); // Call onLoad in finally block
      }
    };

    initCoolingCenters();
  }, [map, layerStates.coolingCenter]); // Depend on map and layerStates.coolingCenter

  useEffect(() => {
    if (map) {
      const handleClick = () => {
        if (fixedInfoWindowRef.current) {
          fixedInfoWindowRef.current.close();
          fixedInfoWindowRef.current = null;
          setCenterMarkerVisible(true); // Add this line
        }
      };
      window.kakao.maps.event.addListener(map, 'click', handleClick);
      return () => {
        window.kakao.maps.event.removeListener(map, 'click', handleClick);
      };
    }
  }, [map, setCenterMarkerVisible]); // Add setCenterMarkerVisible to dependencies

  return { markersRef, openInfoWindowRef, fixedInfoWindowRef };
};