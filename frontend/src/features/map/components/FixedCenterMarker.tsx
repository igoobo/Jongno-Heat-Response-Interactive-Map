import React from 'react';
import { MapPin } from 'lucide-react';

const FixedCenterMarker: React.FC = () => {
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
