import React from 'react';
import { ChatInterface } from './ChatInterface';

export const ChatTabContent: React.FC = () => {
  return (
    <div className="p-4 flex flex-col overflow-y-auto">
      <ChatInterface />
    </div>
  );
};
