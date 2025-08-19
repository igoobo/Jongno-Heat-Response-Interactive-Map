import * as React from 'react';
import { FOOTER_CONTENT } from '../constants/footerContent'; // Import the new constant

interface DesktopSidebarFooterProps {
  children?: React.ReactNode;
}

export const DesktopSidebarFooter: React.FC<DesktopSidebarFooterProps> = ({ children }) => {
  return (
    <div className="mt-auto px-6 py-4 border-t border-border">
      {children}
      <div className="text-center space-y-1">
        <p className="text-xs text-muted-foreground">
          {FOOTER_CONTENT.mainText}
        </p>
        <footer className="text-xs text-muted-foreground">
          <div>
            {FOOTER_CONTENT.openWeather} <a href={FOOTER_CONTENT.openWeatherLink}>{FOOTER_CONTENT.openWeatherText}</a> © 2012–2025 OpenWeather®
          </div>
          <div>
            {FOOTER_CONTENT.kma} <a href={FOOTER_CONTENT.kmaLink}>
            {FOOTER_CONTENT.kmaText}</a>
            <span>{FOOTER_CONTENT.kmaLicense}</span>
          </div>

          <details>
            <summary className="cursor-pointer underline">{FOOTER_CONTENT.detailsSummary}</summary>
            <div className="mt-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: FOOTER_CONTENT.detailsContent }} />
          </details>


        </footer>
      </div>
    </div>
  );
};