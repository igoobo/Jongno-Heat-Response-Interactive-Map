

export const MobileTemperatureLegend = () => {
  const tempRanges = [
    { color: '#a2d6f9', label: '≤ 20°C' },
    { color: '#f1c40f', label: '≤ 25°C' },
    { color: '#f39c12', label: '≤ 30°C' },
    { color: '#e67e22', label: '≤ 35°C' },
    { color: '#e74c3c', label: '> 35°C' },
  ];

  return (
    <div className="absolute top-3 left-3 z-10 p-2 bg-white/40 rounded-lg shadow-md h-[14vh] w-[20vw]">
      {tempRanges.map((item, idx) => (
        <div key={idx} className="flex items-center mb-1">
          <div className="w-3 h-3 mr-2" style={{ backgroundColor: item.color }} />
          <span className="text-xs">{item.label}</span>
        </div>
      ))}
    </div>
  );
};