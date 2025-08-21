import React from 'react';


interface InfographicGaugeProps {
  score: number | null;
  color: string;
}

import { HEAT_ILLNESS_STAGES } from './stages'; // Add this import
import type { Stage } from './types';

export const InfographicGauge: React.FC<InfographicGaugeProps> = ({ score, color }) => {
  // Removed hardcoded gaugeColors and riskLabels

  const needleAngle = score !== null ? -157.5 + 67.5 + (score * 1.8) : -157.5 + 67.5; // Adjusted needle angle calculation
  
  return (
    <div className="relative w-56 h-56 flex items-center justify-center ">
      <svg width="200" height="200" className="absolute">
        {[0, 1, 2, 3].map((segment) => {
          const startAngle = segment * 45 - 180;
          const endAngle = (segment + 1) * 45 - 180;
          const isActive = score !== null && score > (segment === 0 ? 0 : HEAT_ILLNESS_STAGES[segment - 1].threshold);
          const segmentColor = isActive ? HEAT_ILLNESS_STAGES[segment].color : '#e5e5e5';
          
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
        

        {/* 윤곽선 역할 (굵게) */}
        <line
          x1="0"
          y1="-2"
          x2="0"
          y2="-60" // Length of the needle (100 - 40 = 60)
          stroke="black"
          strokeWidth="6"
          strokeLinecap="round"
          transform={`translate(100 100) rotate(${needleAngle})`} // Translate to center, then rotate
          className="transition-all duration-700 ease-out"
        />

        <line
          x1="0"
          y1="0"
          x2="0"
          y2="-60" // Length of the needle
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          transform={`translate(100 100) rotate(${needleAngle})`} // Translate to center, then rotate
          className="transition-all duration-700 ease-out"
        />
      </svg>
      
      <div className="absolute inset-0 flex items-end justify-center pb-4">
        <div className="text-center">
          <div className="text-lg md:text-xs font-medium text-gray-600 mb-1">현재 수준</div>
          <div
            className="text-lg md:text-sm font-bold px-3 py-1 rounded-full text-white"
            style={{ backgroundColor: color }}
          >
            {score !== null ? HEAT_ILLNESS_STAGES.find((s: Stage) => score <= s.threshold)?.name || '알 수 없음' : '로딩 중...'}
          </div>
        </div>
      </div>
      
      
      {HEAT_ILLNESS_STAGES.map((stage, index) => {
        const angle = ((index + 1) * 45) - 180 - 25; // Adjust angle for 0-indexed array
        const angleRad = (angle * Math.PI) / 180;
        const radius = 85;
        const x = 100 + radius * Math.cos(angleRad);
        const y = 100 + radius * Math.sin(angleRad);
        
        const isActive = score !== null && score > (index === 0 ? 0 : HEAT_ILLNESS_STAGES[index - 1].threshold);

        return (
          <div
            key={stage.id}
            className="absolute w-6 h-6 flex items-center justify-center text-lg md:text-xs font-bold text-white rounded-full"
            style={{
              left: `${x - 12}px`,
              top: `${y - 12}px`,
              backgroundColor: isActive ? stage.color : '#d1d5db'
            }}
          >
            {index + 1}
          </div>
        );
      })}
    </div>
  );
};