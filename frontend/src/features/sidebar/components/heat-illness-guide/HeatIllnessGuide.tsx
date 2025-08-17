import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { HEAT_ILLNESS_STAGES } from './stages';
import { InfographicGauge } from './InfographicGauge';
import { StageDetails } from './StageDetails';
import type { Stage } from './types';

export const HeatIllnessGuide: React.FC = () => {
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    const fetchHeatStages = async (retries = 3) => { // Added retries parameter
      try {
        const response = await fetch('/api/heat-stages');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text(); // Read as text first
        let data;
        try {
          data = JSON.parse(text); // Try to parse as JSON
        } catch (jsonError) {
          // If parsing fails, it's likely a string response
          console.warn("Received non-JSON response from /api/heat-stages:", text);
          if (retries > 0) {
            console.log(`Retrying... ${retries} attempts left.`);
            setTimeout(() => fetchHeatStages(retries - 1), 2000); // Retry after 2 seconds
            return;
          } else {
            console.error("Max retries reached. Failed to get valid response.");
            setScore(null);
            return;
          }
        }

        // Check if data.answer exists and is a number or a string that can be parsed to a number
        let finalScore: number | null = null;
        if (typeof data.answer === 'number') {
          finalScore = data.answer;
        } else if (typeof data.answer === 'string') {
          const parsedScore = parseFloat(data.answer);
          if (!isNaN(parsedScore)) {
            finalScore = parsedScore;
          }
        }

        if (finalScore !== null) {
          setScore(finalScore);
        } else {
          console.warn("Received unexpected data format from /api/heat-stages: 'answer' is not a number or a parseable string.", data);
          if (retries > 0) {
            console.log(`Retrying... ${retries} attempts left.`);
            setTimeout(() => fetchHeatStages(retries - 1), 2000); // Retry after 2 seconds
            return;
          } else {
            console.error("Max retries reached. Failed to get valid response.");
            setScore(null);
            return;
          }
        }
      } catch (error) {
        console.error("Failed to fetch heat stages:", error);
        setScore(null); // Reset score on error
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
            className="text-sm px-4 py-1 rounded-full text-white flex items-center justify-center gap-2"
            style={{ backgroundColor: determinedStage.color }}
          >
            {determinedStage.icon}
            {determinedStage.name} {/* Use determinedStage.name for severity */}
          </span>
          <div className="text-sm text-gray-600 mt-2">
            {formattedDate} | 점수: {score !== null ? score : '로딩 중...'}
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