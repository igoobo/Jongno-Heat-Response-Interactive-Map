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
    symptoms: [
      { symptom: "Mild sweating", extraInfo: "Sweating is the body's natural way to cool down." },
      { symptom: "Slight fatigue", extraInfo: "Feeling tired or weary due to heat exposure." },
      { symptom: "Increased thirst", extraInfo: "A sign that your body needs more fluids." }
    ],
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
    symptoms: [
      { symptom: "Heavy sweating", extraInfo: "Excessive perspiration, often accompanied by clammy skin." },
      { symptom: "Weakness", extraInfo: "Feeling of reduced strength or energy." },
      { symptom: "Nausea", extraInfo: "Feeling of sickness with an urge to vomit." },
      { symptom: "Headache", extraInfo: "Pain in the head, often throbbing or dull." }
    ],
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
    symptoms: [
      { symptom: "Muscle cramps", extraInfo: "Involuntary and often painful contractions of muscles." },
      { symptom: "Heavy sweating", extraInfo: "Excessive perspiration, often accompanied by clammy skin." },
      { symptom: "Fatigue", extraInfo: "Extreme tiredness, typically resulting from mental or physical exertion or illness." },
      { symptom: "Dizziness", extraInfo: "A sensation of spinning and a feeling of being off balance." }
    ],
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
    symptoms: [
      { symptom: "High body temperature", extraInfo: "Body temperature of 104°F (40°C) or higher, a hallmark of heatstroke." },
      { symptom: "Altered mental state", extraInfo: "Confusion, irritability, slurred speech, or even seizures." },
      { symptom: "Hot dry skin", extraInfo: "Skin that feels hot to the touch and may be dry or slightly moist." },
      { symptom: "Rapid pulse", extraInfo: "A fast, strong heartbeat, indicating the heart is working harder to cool the body." }
    ],
    action: "Call emergency services immediately",
    icon: <Skull className="w-6 h-6" />
  }
];
