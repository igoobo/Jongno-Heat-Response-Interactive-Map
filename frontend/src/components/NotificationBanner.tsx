import React from 'react';
import './NotificationBanner.css';

import { AlertTriangle } from 'lucide-react';

interface NotificationBannerProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ message, isVisible, onClose }) => {
  return (
    <div className={`notification-banner ${isVisible ? '' : 'hidden'}`}>
      <div className="notification-icon">
        <AlertTriangle size={20} />
      </div>
      <p>{message}</p>
      <button onClick={onClose} className="notification-close-button">×</button>
    </div>
  );
};

export default NotificationBanner;
