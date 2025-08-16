export interface Stage {
  id: number;
  severity: string;
  riskLevel: number; // 1-4 risk level
  color: string;
  bgColor: string;
  description: string;
  symptoms: string[];
  action: string;
  icon: React.ReactNode;
}
