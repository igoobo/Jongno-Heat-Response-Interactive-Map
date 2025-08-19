import React, { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

interface InteractiveTextCardProps {
  text: string;
  extraInfo?: string;
  color: string; // For the dot and potentially other styling
}

export const InteractiveTextCard: React.FC<InteractiveTextCardProps> = ({ text, extraInfo, color }) => {
  const [showExtraInfo, setShowExtraInfo] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (!isPinned) {
      setShowExtraInfo(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isPinned) {
      setShowExtraInfo(false);
    }
  };

  const handleClick = () => {
    setIsPinned(!isPinned);
    setShowExtraInfo(!isPinned);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (itemRef.current && !itemRef.current.contains(event.target as Node)) {
        setIsPinned(false);
        setShowExtraInfo(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [itemRef]);

  return (
    <div
      className="flex items-center gap-2 text-sm relative group cursor-pointer"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={itemRef}
    >
      <div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="text-lg md:text-base flex items-center gap-1">
        {text}
        {extraInfo && <Info size={14} className="text-gray-400" />}
      </span>
      {extraInfo && (
        <div
          className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-base md:text-sm rounded transition-opacity duration-300 pointer-events-none z-10
            ${(showExtraInfo || isPinned) ? 'opacity-100' : 'opacity-0'}
          `}
        >
          {extraInfo}
        </div>
      )}
    </div>
  );
};