import React from 'react';


interface InfographicGaugeProps {
  riskLevel: number;
  color: string;
}

export const InfographicGauge: React.FC<InfographicGaugeProps> = ({ riskLevel, color }) => {
  const gaugeColors = ['#10b981', '#f59e0b', '#ef4444', '#dc2626'];
  const riskLabels = ['관심', '주의', '경고', '위험'];
  
  const needleAngle = -157.5 + (riskLevel + 1) * 45;
  
  return (
    <div className="relative w-56 h-56 flex items-center justify-center">
      <svg width="200" height="200" className="absolute">
        {[0, 1, 2, 3].map((segment) => {
          const startAngle = segment * 45 - 180;
          const endAngle = (segment + 1) * 45 - 180;
          const isActive = segment < riskLevel;
          const segmentColor = isActive ? gaugeColors[segment] : '#e5e5e5';
          
          const startAngleRad = (startAngle * Math.PI) / 180;
          const endAngleRad = (endAngle * Math.PI) / 180;
          const radius = 70;
          const centerX = 100;
          const centerY = 100;
          
          const x1 = centerX + radius * Math.cos(startAngleRad);
          const y1 = centerY + radius * Math.sin(startAngleRad);
          const x2 = centerX + radius * Math.cos(endAngleRad);
          const y2 = centerY + radius * Math.sin(endAngleRad);
          
          const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
          
          return (
            <path
              key={segment}
              d={`M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
              fill={segmentColor}
              stroke="white"
              strokeWidth="2"
              className="transition-all duration-500"
            />
          );
        })}
        
        <circle
          cx="100"
          cy="100"
          r="15"
          fill={color}
          stroke="white"
          strokeWidth="3"
        />
        
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="40"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          transform={`rotate(${needleAngle} 100 100)`}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      
      <div className="absolute inset-0 flex items-end justify-center pb-4">
        <div className="text-center">
          <div className="text-xs font-medium text-gray-600 mb-1">RISK LEVEL</div>
          <div 
            className="text-sm font-bold px-3 py-1 rounded-full text-white"
            style={{ backgroundColor: color }}
          >
            {riskLabels[riskLevel - 1]}
          </div>
        </div>
      </div>
      
      
      {[1, 2, 3, 4].map((stage) => {
        const angle = (stage * 45) - 180 - 25;
        const angleRad = (angle * Math.PI) / 180;
        const radius = 85;
        const x = 100 + radius * Math.cos(angleRad);
        const y = 100 + radius * Math.sin(angleRad);
        
        return (
          <div
            key={stage}
            className="absolute w-6 h-6 flex items-center justify-center text-xs font-bold text-white rounded-full"
            style={{
              left: `${x - 12}px`,
              top: `${y - 12}px`,
              backgroundColor: stage <= riskLevel ? gaugeColors[stage - 1] : '#d1d5db'
            }}
          >
            {stage}
          </div>
        );
      })}
    </div>
  );
};