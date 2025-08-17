import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { HEAT_ILLNESS_STAGES } from './stages';
import { InfographicGauge } from './InfographicGauge';
import { StageDetails } from './StageDetails';
import type { Stage } from './types';

export const HeatIllnessGuide: React.FC = () => {
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchHeatStages = async () => {
      try {
        const response = await fetch('/api/heat-stages');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.answer !== undefined) {
          setScore(data.answer);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error("Failed to fetch heat stages:", error);
        setError(true);
      }
    };

    fetchHeatStages();
  }, []);

  // Determine the current stage based on the score
  const determinedStage = score !== null
    ? HEAT_ILLNESS_STAGES.find((s: Stage) => score <= s.threshold) || HEAT_ILLNESS_STAGES[HEAT_ILLNESS_STAGES.length - 1]
    : HEAT_ILLNESS_STAGES[0]; // Default to first stage if score is null

  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  const formattedDate = `${year}.${month}.${day}`;

  return (
    <div className="w-full max-w-2xl mx-auto p-1">
      <Card className={`border-2 transition-all duration-500`} style={{ borderColor: determinedStage.color }}>
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <CardTitle className="text-2xl">온열질환 수준</CardTitle>
          </div>
          <span
            className="text-lg md:text-sm px-4 py-1 rounded-full text-white flex items-center justify-center gap-2"
            style={{ backgroundColor: determinedStage.color }}
          >
            {determinedStage.icon}
            {determinedStage.name} {/* Use determinedStage.name for severity */}
          </span>
          <div className="text-base md:text-sm text-gray-600 mt-2">
            {formattedDate} | 점수: {score !== null ? score : error ? '오류' : '로딩 중...'}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <InfographicGauge score={score} color={determinedStage.color} />
          </div>

          <StageDetails stage={determinedStage} />



        </CardContent>
      </Card>
    </div>
  );
};