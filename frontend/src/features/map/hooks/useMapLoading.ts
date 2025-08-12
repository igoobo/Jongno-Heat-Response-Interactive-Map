import { useState } from 'react';

export const useMapLoading = () => {
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [isPolygonLayerLoading, setIsPolygonLayerLoading] = useState(true);
  const [isCoolingCenterLayerLoading, setIsCoolingCenterLayerLoading] = useState(true);

  const totalLoading = isMapLoading || isPolygonLayerLoading || isCoolingCenterLayerLoading;

  return {
    totalLoading,
    setIsMapLoading,
    setIsPolygonLayerLoading,
    setIsCoolingCenterLayerLoading,
  };
};