import { useState, useEffect } from 'react';
import { apiClient } from '../apiClient';

interface ChatNotification {
  message: string;
  isVisible: boolean;
  isLoading: boolean;
  dismiss: () => void; // New function to dismiss
}

const useChatNotification = (): ChatNotification => {
  const [notificationMessage, setNotificationMessage] = useState('Loading message...');
  const [showNotification, setShowNotification] = useState(true);
  const [isChatLoading, setIsChatLoading] = useState(true);

  const dismissNotification = () => {
    setShowNotification(false);
  };

  useEffect(() => {
    const fetchChatResponse = async () => {
      setIsChatLoading(true);
      try {
        const data = await apiClient<any>('/api/notification');
        if (data && data.answer) {
          setNotificationMessage(data.answer);
          setShowNotification(true);
        } else {
          setNotificationMessage('');
          setShowNotification(false);
        }
      } catch (error) {
        console.error('Failed to fetch chat response:', error);
        setNotificationMessage('');
        setShowNotification(false);
      } finally {
        setIsChatLoading(false);
      }
    };

    fetchChatResponse();
  }, []);

  return { message: notificationMessage, isVisible: showNotification, isLoading: isChatLoading, dismiss: dismissNotification };
};

export default useChatNotification;