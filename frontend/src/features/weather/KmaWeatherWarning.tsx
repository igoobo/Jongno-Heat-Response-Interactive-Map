import { useEffect, useState } from 'react';

interface KmaWarning {
  REG_UP: string;
  REG_UP_KO: string;
  REG_ID: string;
  REG_KO: string;
  TM_FC: string;
  TM_EF: string;
  WRN: string;
  LVL: string;
  CMD: string;
  ED_TM: string;
}

const KmaWeatherWarning = () => {
  const [warnings, setWarnings] = useState<KmaWarning[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWarnings = async () => {
      try {
        const response = await fetch('/api/kma-weather-warnings');
        if (!response.ok) {
          throw new Error('Failed to fetch KMA weather warnings');
        }
        const data = await response.json();
        setWarnings(data);
      } catch (error) {
        console.error(error);
        setWarnings([]); // Clear warnings on error
      } finally {
        setLoading(false);
      }
    };

    fetchWarnings();
  }, []);

  const getWarningColor = (level: string) => {
    switch (level) {
      case '주의':
        return 'bg-yellow-400';
      case '경보':
        return 'bg-red-600';
      default:
        return 'bg-gray-400';
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const heatWarnings = warnings.filter(warning => warning.WRN.includes(''));

  if (heatWarnings.length === 0) {
    return (
      <div className="absolute top-7 left-7 bg-white/80 p-2 rounded-lg shadow-lg z-10 flex items-center space-x-2">
        <p className="text-[16px]">현재 폭염 특보 없음</p>
        <div className="w-4 h-4 rounded-full bg-white border border-gray-300"></div>
      </div>
    );
  }

  return (
    <div className="absolute top-4 left-4 bg-white/80 p-2 rounded-lg shadow-lg z-10 flex items-center space-x-2 border-2">
      <div>
        <p className="text-[15px]">폭염 특보</p>
        <p className="text-[16px] text-right font-semibold">{heatWarnings[0].LVL}</p>
      </div>
      <div className={`w-4 h-4 rounded-full ${getWarningColor(heatWarnings[0].LVL)}`}></div>
    </div>
  );
};

export default KmaWeatherWarning;
