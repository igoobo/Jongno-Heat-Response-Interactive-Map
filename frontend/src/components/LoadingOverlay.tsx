// components/LoadingOverlay.tsx

import React from 'react';

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 검정색
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 99999,
};


const spinnerStyle: React.CSSProperties = {
  fontSize: '2rem',
  color: '#fff', // 흰색 글씨
  fontWeight: 'bold',
  textShadow: '0 0 5px rgba(0,0,0,0.7)',
};
const LoadingOverlay: React.FC = () => {
  return (
    <div style={overlayStyle}>
      <div style={spinnerStyle}>🚀 지도를 불러오는 중입니다...</div>
    </div>
  );
};

export default LoadingOverlay;
