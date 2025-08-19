import { useMapLocation } from '../../../context/MapLocationContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { MapPin } from 'lucide-react';
import { useRegionName } from '../../../hooks/useRegionName'; // New import

const LocationInfo = () => {
  const { location } = useMapLocation();
  const regionName = useRegionName({ location }); // Use the new hook

  return (
    <Card className="flex flex-col gap-2">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          현재 지도 위치
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-base">
          <p className="text-muted-foreground">행정구역</p>
          <p className="text-xl font-bold">{regionName || '조회 중...'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationInfo;