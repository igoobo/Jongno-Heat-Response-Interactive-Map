import React, { useState } from 'react'; // Remove useEffect
import { createPortal } from 'react-dom';
import { useEscapeKeyClose } from '../../../hooks/useEscapeKeyClose'; // New import

interface HeatGuideModalProps {
  visible: boolean;
  onClose: () => void;
  imageUrl: string;
}

const HeatGuideModal: React.FC<HeatGuideModalProps> = ({ visible, onClose, imageUrl }) => {
  const [loaded, setLoaded] = useState(false);

  // ESC 키로 닫기
  useEscapeKeyClose({ onClose, visible });

  if (!visible) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] flex h-screen"
      onClick={onClose}
    >
      {/* 왼쪽 반 – 이미지 영역 */}
      <div
        className="flex items-center justify-center h-full w-full bg-white flex-1"
        onClick={(e) => e.stopPropagation()} // 내부 클릭은 닫기 방지
      >
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

      {/* 오른쪽 반 – 반투명 오버레이 */}
      <div className="w-1/2 h-screen bg-white/50" />
    </div>
  );

  // ✅ Portal 렌더링
  return createPortal(modalContent, document.body);
};

export default HeatGuideModal;