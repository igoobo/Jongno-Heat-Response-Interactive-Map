// components/TemperatureLegend.tsx

export const TemperatureLegend = () => {
  const tempRanges = [
    { color: '#a2d6f9', label: '≤ 20°C' },
    { color: '#f1c40f', label: '≤ 25°C' },
    { color: '#f39c12', label: '≤ 30°C' },
    { color: '#e67e22', label: '≤ 35°C' },
    { color: '#e74c3c', label: '> 35°C' },
  ];

  return (
    <div style={legendStyle}>
      {tempRanges.map((item, idx) => (
        <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
          <div style={{
            width: 16, height: 16, backgroundColor: item.color, marginRight: 8,
          }} />
          <span style={{ fontSize: 14 }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

const legendStyle: React.CSSProperties = {
  position: 'absolute',
  left: 20,
  bottom: 100,
  backgroundColor: 'rgba(255,255,255,0.9)',
  padding: '10px 12px',
  borderRadius: 6,
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  zIndex: 100,
};