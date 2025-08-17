import React from 'react';
import type { Stage } from './types';
import { SymptomItem } from './SymptomItem';


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
        <h4 className="font-semibold text-gray-800">symtoms:</h4>
        <div className="grid grid-cols-2 gap-2">
          {stage.symptoms.map((symptom, index) => (
            <SymptomItem key={index} symptom={symptom} color={stage.color} />
          ))}
        </div>
      </div>

      <div className="p-4 rounded-lg border-2" style={{ 
        borderColor: stage.color,
        backgroundColor: 'rgba(255, 255, 255, 0.7)'
      }}>
        <h4 className="font-semibold text-gray-800 mb-2">recommend actions:</h4>
        <p className="text-sm text-gray-700">{stage.action}</p>
      </div>
    </div>
  );
};