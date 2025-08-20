import React, { useState } from 'react';
import { Button } from '../../../../components/ui/button';
import { ChatModal } from './ChatModal';

export const ChatTabContent: React.FC = () => {
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  const handleOpenChatModal = () => {
    setIsChatModalOpen(true);
  };

  return (
    <div className="p-4">
      <p className="text-sm text-gray-600 mb-4">
        Click the button below to open the chat interface.
      </p>
      <Button onClick={handleOpenChatModal} className="w-full">
        Open Chat
      </Button>
      <ChatModal open={isChatModalOpen} onOpenChange={setIsChatModalOpen} />
    </div>
  );
};
