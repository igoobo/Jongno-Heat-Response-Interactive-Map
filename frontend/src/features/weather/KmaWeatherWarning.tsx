import { useKmaWeatherWarnings } from './hooks/useKmaWeatherWarnings';

const WARNING_COLORS: { [key: string]: string } = {
  '주의': 'bg-yellow-400',
  '경보': 'bg-red-600',
};

const KmaWeatherWarning = () => {
  const { warnings, loading, error } = useKmaWeatherWarnings();

  const getWarningColor = (level: string) => {
    return WARNING_COLORS[level] || 'bg-gray-400';
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const heatWarnings = warnings.filter(warning => warning.WRN.includes('폭염'));

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
