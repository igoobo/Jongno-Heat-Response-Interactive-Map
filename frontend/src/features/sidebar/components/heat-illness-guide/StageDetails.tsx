import React from 'react';
import type { Stage } from './types';


interface StageDetailsProps {
  stage: Stage;
}

export const StageDetails: React.FC<StageDetailsProps> = ({ stage }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-gray-700 leading-relaxed">{stage.description}</p>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-gray-800">증상:</h4>
        <div className="grid grid-cols-2 gap-2">
          {stage.symptoms.map((symptom, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: stage.color }}
              />
              {symptom}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-lg border-2" style={{ 
        borderColor: stage.color,
        backgroundColor: 'rgba(255, 255, 255, 0.7)'
      }}>
        <h4 className="font-semibold text-gray-800 mb-2">추천:</h4>
        <p className="text-sm text-gray-700">{stage.action}</p>
      </div>
    </div>
  );
};