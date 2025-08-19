import { useEffect } from 'react';

interface UseEscapeKeyCloseProps {
  onClose: () => void;
  visible: boolean;
}

export const useEscapeKeyClose = ({ onClose, visible }: UseEscapeKeyCloseProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (visible) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, onClose]);
};
