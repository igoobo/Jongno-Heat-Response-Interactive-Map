import React from 'react';
import './NotificationBanner.css';

interface NotificationBannerProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ message, isVisible, onClose }) => {
  return (
    <div className={`notification-banner ${isVisible ? '' : 'hidden'}`}>
      <div className="notification-icon">
        {/* Generic Info Icon SVG */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20px" height="20px">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
      </div>
      <p>{message}</p>
      <button onClick={onClose} className="notification-close-button">×</button>
    </div>
  );
};

export default NotificationBanner;
