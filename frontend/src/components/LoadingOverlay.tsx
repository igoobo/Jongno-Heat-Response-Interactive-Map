import React from 'react';

const LoadingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex flex-col items-center justify-center z-[99999] space-y-4">
      <div className="relative flex items-center justify-center">
        {/* Outer ring (background) */}
        <div className="w-20 h-20 rounded-full border-4 border-gray-700"></div>
        {/* Inner ring (spinner) */}
        <div className="absolute w-20 h-20 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
        {/* Center icon/text */}
        <div className="absolute text-black text-2xl font-bold">🗺️</div>
      </div>
      <p className="text-black text-lg font-semibold">지도를 불러오는 중입니다...</p>
      <p className="text-gray-700 text-sm">잠시만 기다려 주세요.</p>
    </div>
  );
};

export default LoadingOverlay;
