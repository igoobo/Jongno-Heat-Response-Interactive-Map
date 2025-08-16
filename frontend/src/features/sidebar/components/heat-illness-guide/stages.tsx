import { Thermometer, AlertTriangle, AlertCircle, Skull } from 'lucide-react';
import type { Stage } from './types';

export const HEAT_ILLNESS_STAGES: Stage[] = [
  {
    id: 1,
    name: "관심", // Renamed from severity
    threshold: 25, // Example threshold
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
    name: "주의", // Renamed from severity
    threshold: 50, // Example threshold
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
    name: "경고", // Renamed from severity
    threshold: 75, // Example threshold
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
    name: "위험", // Renamed from severity
    threshold: 100, // Example threshold
    riskLevel: 4,
    color: "#dc2626",
    bgColor: "bg-red-100",
    description: "Life-threatening emergency requiring immediate emergency medical care.",
    symptoms: ["High body temperature", "Altered mental state", "Hot dry skin", "Rapid pulse"],
    action: "Call emergency services immediately",
    icon: <Skull className="w-6 h-6" />
  }
];
