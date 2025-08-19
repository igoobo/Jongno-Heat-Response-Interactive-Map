import React from 'react';
import FixedCenterMarker from './FixedCenterMarker';
import NotificationBanner from '../../../components/NotificationBanner';
import KakaoMapLicense from '../../../components/KakaoMapLicense';
import ZoomControls from './MapControls/ZoomControls';

interface MapUIControlsProps {
  map: any;
  isDesktop: boolean;
  notificationMessage: string;
  showNotification: boolean;
  dismissNotification: () => void;
  children: React.ReactNode; // Add children prop
}

export const MapUIControls: React.FC<MapUIControlsProps> = ({
  map,
  isDesktop,
  notificationMessage,
  showNotification,
  dismissNotification,
  children, // Destructure children
}) => {
  return (
    <>
      {children} {/* Render children (the map div) */}
      <FixedCenterMarker />
      <NotificationBanner
        message={notificationMessage}
        isVisible={showNotification}
        onClose={dismissNotification}
      />
      {isDesktop && <KakaoMapLicense />}
      {isDesktop && map && <ZoomControls map={map} defaultLevel={5} />}
    </>
  );
};