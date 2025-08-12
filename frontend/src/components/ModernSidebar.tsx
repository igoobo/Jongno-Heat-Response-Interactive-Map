import DesktopSidebarA from './sidebar/DesktopSidebarA';
import DesktopSidebarB from './sidebar/DesktopSidebarB';
import { useState } from 'react';

interface ModernSidebarProps {}

type SidebarType = 'A' | 'B';

const ModernSidebar: React.FC<ModernSidebarProps> = () => {
  const [activeSidebar, setActiveSidebar] = useState<SidebarType>('A');
  const isA = activeSidebar === 'A';

  return (
    <div className="flex h-full">
      {/* <DesktopSidebar /> */}
      {/* 사이드바 컨테이너 */}
      <div className="absolute top-0 right-0 h-full w-110 z-40 ">
        {/*    */}
        <div
          className={`
            absolute top-0 left-0 w-full h-full p-4 bg-white border-l
            transition-all duration-300
            ${isA ? 'z-50 shadow-xl' : 'z-40 shadow-md'}
          `}
        >
          <DesktopSidebarA />
        </div>

        {/* Sidebar B */}
        <div
          className={`
            absolute top-0 left-0 w-full h-full p-4 bg-white border-l
            transition-all duration-300
            ${!isA ? 'z-50 shadow-xl' : 'z-40 shadow-md'}
          `}
        >
          <DesktopSidebarB />
        </div>

         {/* 책갈피 버튼 그룹 */}
        <div className="absolute top-4 -left-13 flex flex-col gap-2">
          {/* 버튼 A */}
          <button
            onClick={() => setActiveSidebar('A')}
            className={`
              w-10 h-10 rounded-l-md text-sm font-semibold transition-all
              border border-gray-200
              ${isA 
                ? 'bg-white text-blue-600 shadow-xl z-50' 
                : 'bg-white text-blue-300 shadow-inner z-40'}
            `}
            title="Sidebar A"
          >
            A
          </button>

          {/* 버튼 B */}
          <button
            onClick={() => setActiveSidebar('B')}
            className={`
              w-10 h-10 rounded-l-md text-sm font-semibold transition-all
              border border-gray-200
              ${!isA 
                ? 'bg-white text-green-600 shadow-xl z-50' 
                : 'bg-white text-green-300 shadow-inner z-40'}
            `}
            title="Sidebar B"
          >
            B
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModernSidebar;