import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ChatFab } from '../features/sidebar/components/chat-sidebar/ChatFab';
import { ChatModal } from '../features/sidebar/components/chat-sidebar/ChatModal';

interface GlobalOverlaysProps {
  isDesktop: boolean;
  isChatModalOpen: boolean;
  setIsChatModalOpen: (open: boolean) => void;
}

export const GlobalOverlays: React.FC<GlobalOverlaysProps> = ({ isDesktop, isChatModalOpen, setIsChatModalOpen }) => {
  return (
    <>
      <ChatFab onClick={() => setIsChatModalOpen(true)} isDesktop={isDesktop} />
      <ChatModal open={isChatModalOpen} onOpenChange={setIsChatModalOpen} />
      <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
    </>
  );
};
