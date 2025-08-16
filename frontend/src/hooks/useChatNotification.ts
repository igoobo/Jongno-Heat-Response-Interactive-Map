import { useState, useEffect } from 'react';

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
        const response = await fetch('/api/notification');
        const data = await response.json();
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