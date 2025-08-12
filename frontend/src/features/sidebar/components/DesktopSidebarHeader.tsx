import { MapPin } from 'lucide-react';
import * as React from 'react';

export const DesktopSidebarHeader: React.FC = () => {
  return (
    <div className="p-5 border-b border-border">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <MapPin className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-semibold text-lg">종로구 지도</h2>
          <p className="text-sm text-muted-foreground">Seoul, South Korea</p>
        </div>
      </div>
    </div>
  );
};