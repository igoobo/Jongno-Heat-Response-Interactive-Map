import React from 'react';

interface ZoomControlsProps {
  map: kakao.maps.Map | null;
  defaultLevel?: number;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({ map, defaultLevel = 5 }) => {
  const zoomIn = () => {
    if (!map) return;
    const level = map.getLevel();
    if (level > 1) {
      map.setLevel(level - 1);
    }
  };

  const zoomOut = () => {
    if (!map) return;
    const level = map.getLevel();
    map.setLevel(level + 1);
  };

  const resetZoom = () => {
    if (!map) return;
    map.setLevel(defaultLevel);
  };

  return (
    <div style={containerStyle}>
      <button style={buttonStyle} onClick={zoomIn}>＋</button>
      <button style={buttonStyle} onClick={resetZoom}>⟳</button>
      <button style={buttonStyle} onClick={zoomOut}>−</button>
    </div>
  );
};

export default ZoomControls;

// ✅ 스타일 정의
const containerStyle: React.CSSProperties = {
  position: 'fixed',
  top: '50%',
  left: '14px',
  transform: 'translateY(-50%)',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  borderRadius: '10px',
  padding: '6px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  zIndex: 10000,
};

const buttonStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  border: 'none',
  borderRadius: '6px',
  fontSize: '18px',
  fontWeight: 500,
  backgroundColor: '#ffffff',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
};

// ✅ 스타일 커스터마이징: 호버 시 굵은 글씨 적용
// 인라인 스타일로는 불가능하므로 CSS-in-JS 또는 외부 CSS 사용 필요
