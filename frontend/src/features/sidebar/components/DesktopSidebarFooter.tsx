import * as React from 'react';

interface DesktopSidebarFooterProps {
  children?: React.ReactNode;
}

export const DesktopSidebarFooter: React.FC<DesktopSidebarFooterProps> = ({ children }) => {
  return (
    <div className="mt-auto px-6 py-4 border-t border-border">
      {children}
      <div className="text-center space-y-1">
        <p className="text-xs text-muted-foreground">
          Jongno Heat Response Interactive Map
        </p>
        <footer className="text-xs text-muted-foreground">
          <div>
            Weather data provided by <a href="https://openweathermap.org/">OpenWeather</a> © 2012–2025 OpenWeather®
          </div>
          <div>
            and <a href="https://apihub.kma.go.kr/">
            Korea Meteorological Administration (KMA)</a>
            <span> (KOGL 제1유형)</span>
          </div>

          <details>
            <summary className="cursor-pointer underline">자세히</summary>
            <div className="mt-1 leading-relaxed">
              본 저작물은 '기상청'에서 '2025년' 작성하여 공공누리 제1유형으로 개방한 <br/> 
              '기온 예보 자료(API)'를 이용하였으며, 해당 저작물은 <br/> 
              '기상청, https://apihub.kma.go.kr/'에서 무료로 다운받으실 수 있습니다.
            </div>
          </details>




        </footer>
      </div>
    </div>
  );
};