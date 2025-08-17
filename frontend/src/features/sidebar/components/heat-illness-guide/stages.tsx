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
    description: "열로 인한 불편함의 초기 신호입니다. 체온 상승에 신체가 반응하기 시작합니다.",
    mainIllness: [
      { illness: "열실신", extraInfo: "더운 환경에서 장시간 서 있거나 갑자기 자세를 바꿀 때 뇌로 가는 혈액량이 일시적으로 줄어들어 발생하는 일시적인 의식 소실입니다." },
      { illness: "열부종", extraInfo: "더운 환경에 노출된 후 손, 발, 발목 등에 부종이 발생하는 상태입니다. 일반적으로 심각하지 않으며, 시원한 곳에서 휴식하고 다리를 높이 올리면 완화됩니다." }
    ],
    symptoms: [
      { symptom: "약한 땀 분비", extraInfo: "땀은 체온을 낮추기 위한 신체의 자연스러운 반응입니다." },
      { symptom: "가벼운 피로감", extraInfo: "더위로 인해 피곤하거나 나른함을 느낄 수 있습니다." },
      { symptom: "갈증 증가", extraInfo: "체내 수분이 부족하다는 신호입니다." }
    ],
    action: "수분을 충분히 섭취하고 그늘에서 휴식하세요.",
    firstAid: "시원한 물을 마시고, 서늘한 곳에서 쉬며, 젖은 수건으로 몸을 닦아 체온을 낮춥니다.",
    icon: <Thermometer className="w-6 h-6" />
  },
  {
    id: 2,
    name: "주의", // Renamed from severity
    threshold: 50, // Example threshold
    riskLevel: 2,
    color: "#f59e0b",
    bgColor: "bg-amber-50",
    description: "즉각적인 주의와 냉각 조치가 필요한 중등도의 열 질환입니다.",
    mainIllness: [
                  { illness: "열탈진", extraInfo: "고온 환경에서 장시간 활동하여 발생하는 탈수 및 전해질 불균형 상태입니다. 즉시 시원한 곳으로 이동하여 휴식하고 수분을 섭취해야 합니다." },
                  { illness: "열실신", extraInfo: "더운 환경에서 장시간 서 있거나 갑자기 자세를 바꿀 때 뇌로 가는 혈액량이 일시적으로 줄어들어 발생하는 일시적인 의식 소실입니다." },
                  { illness: "열부종", extraInfo: "더운 환경에 노출된 후 손, 발, 발목 등에 부종이 발생하는 상태입니다. 일반적으로 심각하지 않으며, 시원한 곳에서 휴식하고 다리를 높이 올리면 완화됩니다." }
    ],
    symptoms: [
      { symptom: "심한 땀 분비", extraInfo: "피부가 축축해질 정도로 과도한 땀이 납니다." },
      { symptom: "쇠약감", extraInfo: "기력이 떨어지거나 에너지가 부족한 느낌이 듭니다." },
      { symptom: "메스꺼움", extraInfo: "구토하고 싶은 느낌이 들며 속이 울렁거립니다." },
      { symptom: "두통", extraInfo: "머리가 지끈거리거나 둔하게 아픈 증상입니다." }
    ],
    action: "시원한 곳으로 이동하고, 찬물로 몸을 식히세요.",
    firstAid: "환자를 서늘한 곳으로 옮기고, 옷을 헐겁게 하며, 찬물로 몸을 닦거나 부채질을 하여 체온을 낮춥니다. 의식이 있다면 스포츠 음료를 마시게 합니다.",
    icon: <AlertTriangle className="w-6 h-6" />
  },
  {
    id: 3,
    name: "경고", // Renamed from severity
    threshold: 75, // Example threshold
    riskLevel: 3,
    color: "#ef4444",
    bgColor: "bg-red-50",
        description: "근육 경련을 동반한 심각한 열 질환입니다. 즉각적인 의료 처치가 필요할 수 있습니다.",
    mainIllness: [{ illness: "열사병", extraInfo: "체온 조절 기능이 상실되어 발생하는 생명을 위협하는 응급 상황입니다. 즉시 119에 신고하고 응급 처치를 시작해야 합니다." },
                  { illness: "열경련", extraInfo: "격렬한 운동 후 땀을 많이 흘렸을 때 발생하는 근육의 통증성 경련입니다. 주로 종아리, 허벅지, 복부 등에 나타나며, 수분과 염분 보충이 필요합니다." },
                  { illness: "열탈진", extraInfo: "고온 환경에서 장시간 활동하여 발생하는 탈수 및 전해질 불균형 상태입니다. 즉시 시원한 곳으로 이동하여 휴식하고 수분을 섭취해야 합니다." },
    ],
    symptoms: [
      { symptom: "근육 경련", extraInfo: "의지와 상관없이 발생하는 고통스러운 근육 수축입니다." },
      { symptom: "심한 땀 분비", extraInfo: "피부가 축축해질 정도로 과도한 땀을 흘립니다." },
      { symptom: "피로", extraInfo: "정신적 또는 육체적 활동이나 질병으로 인한 극심한 피로감입니다." },
      { symptom: "어지러움", extraInfo: "빙글빙글 도는 느낌이나 균형이 무너진 듯한 감각이 듭니다." }
    ],
    action: "증상 발현 시 즉시 의료진의 진료를 받으세요.",
    firstAid: "즉시 119에 신고하고, 환자를 서늘한 곳으로 옮겨 옷을 벗기고, 찬물로 몸을 적시거나 얼음 주머니를 사용하여 체온을 낮춥니다. 의식이 없는 환자에게는 아무것도 먹이지 않습니다.",
    icon: <AlertCircle className="w-6 h-6" />
  },
  {
    id: 4,
    name: "위험", // Renamed from severity
    threshold: 100, // Example threshold
    riskLevel: 4,
    color: "#dc2626",
    bgColor: "bg-red-100",
    description: "즉각적인 응급 처치가 필요한 생명을 위협하는 응급 상황입니다.",
    mainIllness: [{ illness: "열사병", extraInfo: "체온 조절 기능이 상실되어 발생하는 생명을 위협하는 응급 상황입니다. 즉시 119에 신고하고 응급 처치를 시작해야 합니다." },
                  { illness: "열탈진", extraInfo: "고온 환경에서 장시간 활동하여 발생하는 탈수 및 전해질 불균형 상태입니다. 즉시 시원한 곳으로 이동하여 휴식하고 수분을 섭취해야 합니다." },
    ],
    symptoms: [
      { symptom: "고체온", extraInfo: "체온이 40도(섭씨) 이상으로 상승하며, 열사병의 주요 징후입니다." },
      { symptom: "의식 혼란", extraInfo: "혼란, 과민 반응, 말이 어눌해지거나 경련 등이 나타날 수 있습니다." },
      { symptom: "뜨겁고 건조한 피부", extraInfo: "피부가 만졌을 때 뜨겁고, 건조하거나 약간 습할 수 있습니다." },
      { symptom: "빠른 맥박", extraInfo: "체온 조절을 위해 심장이 더 빠르고 강하게 뛰는 상태입니다." },
    ],
    action: "증상 발현 시 즉시 응급 구조를 요청하세요.",
    firstAid: "즉시 119에 신고하고, 구급대원이 올 때까지 환자를 서늘한 곳으로 옮겨 옷을 벗기고, 찬물로 몸을 적시거나 얼음 주머니를 사용하여 체온을 낮춥니다. 의식이 없는 환자에게는 아무것도 먹이지 않습니다.",
    icon: <Skull className="w-6 h-6" />
  }
];
