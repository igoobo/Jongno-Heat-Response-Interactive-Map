import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useEscapeKeyClose } from '../../../hooks/useEscapeKeyClose';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { X } from 'lucide-react';

interface HeatGuideModalProps {
  visible: boolean;
  onClose: () => void;
  imageUrl: string;
}

const HeatGuideModal: React.FC<HeatGuideModalProps> = ({ visible, onClose, imageUrl }) => {
  const [loaded, setLoaded] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  useEscapeKeyClose({ onClose, visible });

  if (!visible) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] flex h-screen"
      onClick={onClose}
    >
      <div
        className={`relative flex items-center justify-center h-full ${isDesktop ? 'w-1/2 flex-1' : 'w-full h-[calc(100vh-4rem)]'} bg-white`}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-20"
        >
          <X size={24} />
        </button>
        {!loaded && (
          <div className="flex items-center justify-center h-full w-full">
            <span className="text-gray-500">로딩 중...</span>
          </div>
        )}
        <img
          src={imageUrl}
          alt="온열질환 예방가이드"
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`h-full aspect-[16/9] object-contain transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>

      {isDesktop && <div className="w-1/2 h-screen bg-white/50" />}
    </div>
  );

  // ✅ Portal 렌더링
  return createPortal(modalContent, document.body);
};

export default HeatGuideModal;