import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/button';
// import { Navigation, Layers, Info, FileText } from 'lucide-react'; // For Help Button
import { Navigation, Layers, FileText } from 'lucide-react';
import { useMapStore } from '../../../stores/useMapStore';
import { useCurrentLocation } from '../../../hooks/useCurrentLocation'; // 아까 만든 훅
import { moveToCurrentLocation } from '../../map/components/MapControls/moveToCurrentLocation'; // 아까 만든 함수
import { moveToFullView } from '../../map/components/MapControls/moveToFullView'; // ✅ 추가
import { useMapLayer } from '../../../context/MapLayerContext'; // ✅ 추가
import HeatGuideModal from './HeatGuideModal'; // 방금 만든 모달 임포트
const quickActions = [
  { label: '현재 위치', icon: Navigation },
  { label: '전체보기', icon: Layers },
  // { label: '도움말', icon: Info },
  { label: '온열질환 예방가이드', icon: FileText },
];

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

  const handleClick = (label: string) => {
    if (label === '현재 위치') {
      console.log('🖱 현재 위치 버튼 클릭');
       getLocation(map); // ✅ 항상 현재 지도 기준으로 이동
    }else if (label === '전체보기') {
      if (map) {
        setAllLayers(true); // ✅ 레이어 전부 활성화
        moveToFullView(map); // ✅ 적당한 위치로 지도 이동
      }
    }else if (label === '온열질환 예방가이드') {
      setHeatGuideVisible(true);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">빠른 작업</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="ghost"
              className="text-base w-full justify-start gap-3 h-auto py-3"
              onClick={() => handleClick(action.label)}
            >
              <action.icon className="w-4 h-4" />
              {action.label}
            </Button>
          ))}
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