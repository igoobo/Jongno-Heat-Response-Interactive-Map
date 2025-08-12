import React from 'react';
import { MapPin } from 'lucide-react';
import { useCenterMarker } from '../../../context/CenterMarkerContext'; // Import the new hook

const FixedCenterMarker: React.FC = () => {
  const { isCenterMarkerVisible } = useCenterMarker();

  if (!isCenterMarkerVisible) {
    return null; // Don't render if not visible
  }

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 10,
      }}
    >
      <div title="현재 지도 중심">
        <MapPin size={24} color="green" />
      </div>
    </div>
  );
};

export default FixedCenterMarker;
