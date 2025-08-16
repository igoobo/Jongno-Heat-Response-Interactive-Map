import { Thermometer, AlertTriangle, AlertCircle, Skull } from 'lucide-react';
import type { Stage } from './types';

export const stages: Stage[] = [
  {
    id: 1,
    severity: "열 스트레스",
    riskLevel: 1,
    color: "#10b981",
    bgColor: "bg-emerald-50",
    description: "Early signs of heat-related discomfort. Body is beginning to respond to elevated temperatures.",
    symptoms: ["Mild sweating", "Slight fatigue", "Increased thirst"],
    action: "Stay hydrated and find shade",
    icon: <Thermometer className="w-6 h-6" />
  },
  {
    id: 2,
    severity: "열 탈진",
    riskLevel: 2,
    color: "#f59e0b",
    bgColor: "bg-amber-50",
    description: "Moderate heat illness requiring immediate attention and cooling measures.",
    symptoms: ["Heavy sweating", "Weakness", "Nausea", "Headache"],
    action: "Move to cool area, apply cool water",
    icon: <AlertTriangle className="w-6 h-6" />
  },
  {
    id: 3,
    severity: "열 경련",
    riskLevel: 3,
    color: "#ef4444",
    bgColor: "bg-red-50",
    description: "Severe heat illness with muscle cramping. Immediate medical attention may be required.",
    symptoms: ["Muscle cramps", "Heavy sweating", "Fatigue", "Dizziness"],
    action: "Seek medical attention immediately",
    icon: <AlertCircle className="w-6 h-6" />
  },
  {
    id: 4,
    severity: "열사병",
    riskLevel: 4,
    color: "#dc2626",
    bgColor: "bg-red-100",
    description: "Life-threatening emergency requiring immediate emergency medical care.",
    symptoms: ["High body temperature", "Altered mental state", "Hot dry skin", "Rapid pulse"],
    action: "Call emergency services immediately",
    icon: <Skull className="w-6 h-6" />
  }
];
