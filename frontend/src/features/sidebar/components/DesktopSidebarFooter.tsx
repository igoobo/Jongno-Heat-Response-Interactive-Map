import * as React from 'react';

export const DesktopSidebarFooter: React.FC = () => {
  return (
    <div className="mt-auto p-6 border-t border-border">
      <div className="text-center space-y-2">
        <p className="text-xs text-muted-foreground">
          Jongno Heat Response Interactive Map
        </p>
        <footer className="text-xs text-muted-foreground">
          Weather data provided by <a href="https://openweathermap.org/">OpenWeather</a> © 2012–2025 OpenWeather®
        </footer>
      </div>
    </div>
  );
};