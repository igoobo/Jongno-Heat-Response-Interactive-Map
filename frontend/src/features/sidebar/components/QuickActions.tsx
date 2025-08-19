import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/button';
import * as LucideIcons from 'lucide-react';
import { useMapStore } from '../../../stores/useMapStore';
import { useCurrentLocation } from '../../../hooks/useCurrentLocation';
import { moveToCurrentLocation } from '../../map/components/MapControls/moveToCurrentLocation';
import { moveToFullView } from '../../map/components/MapControls/moveToFullView';
import { useMapLayer } from '../../../context/MapLayerContext';
import HeatGuideModal from './HeatGuideModal';
import { QUICK_ACTIONS_DATA } from '../constants/quickActionsData';

const IconMap: { [key: string]: React.ElementType } = {
  Navigation: LucideIcons.Navigation,
  Layers: LucideIcons.Layers,
  FileText: LucideIcons.FileText,
};

const QuickActions = () => {
  const map = useMapStore((state: any) => state.map);
  const { getLocation, position } = useCurrentLocation();
  const { setAllLayers } = useMapLayer(); // ✅ 전체 레이어 켜기
  const [HeatGuideVisible, setHeatGuideVisible] = useState(false);
  // 👉 위치 바뀌면 지도 이동
  useEffect(() => {
    if (position && map) {
      console.log('📍 위치 바뀜 -> 지도 이동');
      moveToCurrentLocation(map, position.lat, position.lng);
    }
  }, [position, map]);

  const handleCurrentLocationClick = () => {
    console.log('🖱 현재 위치 버튼 클릭');
    getLocation(map); // ✅ 항상 현재 지도 기준으로 이동
  };

  const handleFullViewClick = () => {
    if (map) {
      setAllLayers(true); // ✅ 레이어 전부 활성화
      moveToFullView(map); // ✅ 적당한 위치로 지도 이동
    }
  };

  const handleHeatGuideClick = () => {
    setHeatGuideVisible(true);
  };

  const handleClick = (type: string) => {
    switch (type) {
      case 'currentLocation':
        handleCurrentLocationClick();
        break;
      case 'fullView':
        handleFullViewClick();
        break;
      case 'heatGuide':
        handleHeatGuideClick();
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">빠른 작업</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {QUICK_ACTIONS_DATA.map((action) => {
            const Icon = IconMap[action.icon];
            return (
              <Button
                key={action.type}
                variant="ghost"
                className="text-base w-full justify-start gap-3 h-auto py-3"
                onClick={() => handleClick(action.type)}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {action.label}
              </Button>
            );
          })}
        </CardContent>
      </Card>
      <HeatGuideModal
        visible={HeatGuideVisible}
        onClose={() => setHeatGuideVisible(false)}
        imageUrl="/heat_guide.png"
      />
    </>
    
  );
};

export default QuickActions;