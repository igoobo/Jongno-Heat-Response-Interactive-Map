import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { stages } from './stages.tsx';
import { InfographicGauge } from './InfographicGauge';
import { StageDetails } from './StageDetails';

export const HeatIllnessGuide: React.FC = () => {
  const [currentStage, ] = useState(0);
  const stage = stages[currentStage];

  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  const formattedDate = `${year}.${month}.${day}`;

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <Card className={`${stage.bgColor} border-2 transition-all duration-500`} style={{ borderColor: stage.color }}>
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div style={{ color: stage.color }}>
              {stage.icon}
            </div>
            <CardTitle className="text-2xl">온열질환 수준</CardTitle>
          </div>
          <span 
            className="text-sm px-4 py-1 rounded-full text-white"
            style={{ backgroundColor: stage.color }}
          >
            {stage.severity}
          </span>
          <div className="text-sm text-gray-600 mt-2">{formattedDate} | 점수: </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <InfographicGauge riskLevel={stage.riskLevel} color={stage.color} />
          </div>

          <StageDetails stage={stage} />



        </CardContent>
      </Card>
    </div>
  );
};