import React from 'react';

type Props = {
  hourIndex: number;
  max: number;
  onChange: (value: number) => void;
};

// 숫자를 두 자리 문자열로 만들어주는 도우미 함수 (예: 7 -> "07")
const padZero = (num: number): string => num.toString().padStart(2, '0');

// 시간에 따라 표시될 레이블을 생성하는 함수
const formatLabel = (hourIndex: number, baseDate: Date): string => {
  // hourIndex * 3 -> hourIndex * 1 (1시간 간격으로 계산)
  const futureDate = new Date(baseDate.getTime() + hourIndex * 1 * 60 * 60 * 1000);

  const month = padZero(futureDate.getMonth() + 1);
  const day = padZero(futureDate.getDate());
  const hours = padZero(futureDate.getHours());
  
  const timeFormat = `${hours}:00`;

  // 첫 번째 인덱스는 항상 날짜를 표시하여 기준점을 알려줍니다.
  if (hourIndex === 0) {
    return `${month}/${day} ${timeFormat}`;
  }
  // 이전 시간의 날짜를 가져옵니다.
  const previousDate = new Date(baseDate.getTime() + (hourIndex - 3) * 60 * 60 * 1000);

  // 이전 시간과 현재 시간의 날짜(day)가 다를 경우 (즉, 다음 날로 넘어간 첫 시간)
  // month/day를 함께 표시합니다.
  if (futureDate.getDate() !== previousDate.getDate()) {
    return `${month}/${day} ${timeFormat}`;
  }
  
  return timeFormat;
};

export const TemperatureSlider: React.FC<Props> = ({ hourIndex, max, onChange }) => {
  // 기준 시간을 한 번만 생성하여 모든 레이블 계산에 동일하게 적용
  const baseDate = new Date();

  // 0부터 max까지의 모든 시간 인덱스 배열 생성
  const allHourIndices = Array.from({ length: max + 1 }, (_, i) => i);
  const [isPlaying, setIsPlaying] = React.useState(false);
  
  React.useEffect(() => {
  if (!isPlaying) return;

  const interval = setInterval(() => {
      if (hourIndex >= max) {
        onChange(0); // ✅ 루프: 다시 처음으로
      } else {
        onChange(hourIndex + 1);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [isPlaying, hourIndex, max, onChange]);

  return (
    <div style={sliderContainerStyle}>
      {/* ▶ 재생/일시정지 버튼 */}
      <button onClick={() => setIsPlaying((prev) => !prev)} style={playButtonStyle}>
        {isPlaying ? '⏸ 정지' : '▶ 재생'}
      </button>

      <input
        type="range"
        min={0}
        max={max}
        value={hourIndex}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%' }}
      />
      
      {/* 눈금과 시간 레이블을 표시하는 컨테이너 */}
      <div style={ticksContainerStyle}>
        {allHourIndices.map((idx) => (
          <div key={idx} style={tickStyle}>
            {/* 현재 선택된 값(hourIndex)과 일치하는 레이블은 굵게 표시 */}
             <span style={{ fontWeight: idx === hourIndex ? 'bold' : 'normal' }}>
              {/* ⭐️ 변경점: 레이블이 너무 많아지지 않도록 3시간 간격으로만 텍스트 표시 */}
              {idx % 3 === 0 ? formatLabel(idx, baseDate) : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 스타일 정의 ---

const sliderContainerStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 20,
  left: '45%',
  transform: 'translateX(-50%)',
  width: '60%', // 너비를 조금 늘려 레이블이 겹치지 않게 함
  padding: '12px 16px',
  backgroundColor: 'rgba(255,255,255,0.9)',
  borderRadius: 8,
  boxShadow: '0 0 8px rgba(0,0,0,0.1)',
  zIndex: 100,
};

const ticksContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between', // 레이블들을 균일한 간격으로 배치
  width: '100%',
  marginTop: '8px',
  padding: '0 5px', // 좌우 패딩을 주어 슬라이더 끝과 맞춤
  boxSizing: 'border-box',
};

const tickStyle: React.CSSProperties = {
  textAlign: 'center',
  fontSize: '11px', // 폰트 크기를 살짝 줄여 공간 확보
  color: '#333',
  // 각 레이블이 독립적으로 공간을 차지하도록 설정
  flex: 1, 
  pointerEvents: 'none', 
};

const playButtonStyle: React.CSSProperties = {
  position: 'absolute',
  left: -80,
  bottom: 20,
  background: '#fff',
  border: '1px solid #ccc',
  borderRadius: 4,
  padding: '6px 12px',
  fontSize: '12px',
  cursor: 'pointer',
  boxShadow: '0 0 5px rgba(0,0,0,0.1)',
};