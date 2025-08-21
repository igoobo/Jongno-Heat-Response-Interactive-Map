import React from 'react';
import { X } from 'lucide-react';

interface SlideInPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  positioningClass?: string; // For fixed positioning like 'fixed left-0 w-full' etc.
  animationStyle?: React.CSSProperties; // For custom animation styles
  containerClassName?: string; // For additional container classes
}

export const SlideInPanel: React.FC<SlideInPanelProps> = ({
  isOpen,
  onClose,
  children,
  positioningClass = "fixed left-0 w-full",
  animationStyle,
  containerClassName,
}) => {
  return (
    <div
      className={`
        ${positioningClass} bg-white rounded-t-lg z-50
        transition-all duration-300 ease-out
        ${containerClassName || ''}
      `}
      style={{
        bottom: isOpen ? '0' : '-100%', // Default slide from bottom
        maxHeight: isOpen ? 'calc(100vh - 4rem)' : '0', // Default height
        overflowY: 'auto', // Changed from overflow: 'hidden' to overflowY: 'auto'
        ...animationStyle,
      }}
    >
      <div className="flex justify-end p-1">
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>
      <div className="px-2 pb-2 overflow-x-auto">
        {children}
      </div>
    </div>
  );
};
