import React from 'react';
import { ChatInterface } from './ChatInterface';

export const ChatTabContent: React.FC = () => {
  return (
    <div className="p-4 h-full flex flex-col">
      <ChatInterface />
    </div>
  );
};
