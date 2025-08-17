export interface Stage {
  id: number;
  name: string; // Renamed from severity
  threshold: number; // Added threshold
  riskLevel: number; // 1-4 risk level
  color: string;
  bgColor: string;
  description: string;
  mainIllness: { illness: string; extraInfo?: string; }[];
  symptoms: { symptom: string; extraInfo?: string; }[];
  action: string;
  firstAid: string;
  icon: React.ReactNode;
}
