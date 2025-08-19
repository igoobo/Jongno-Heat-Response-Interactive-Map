import React from 'react';

interface WeatherIconProps {
  iconCode: string;
  altText: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ iconCode, altText }) => {
  const ICON_BASE_URL = 'https://openweathermap.org/img/wn/';

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <div className="absolute w-20 h-20 rounded-full bg-blue-400 opacity-78 blur-xl" />
      <img
        src={`${ICON_BASE_URL}${iconCode}@4x.png`}
        alt={altText}
        className="w-20 h-20 relative z-10"
      />
    </div>
  );
};

export default WeatherIcon;
