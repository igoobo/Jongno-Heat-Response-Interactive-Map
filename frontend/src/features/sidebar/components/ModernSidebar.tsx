import DesktopSidebarA from './DesktopSidebarA';
import DesktopSidebarB from './DesktopSidebarB';
import { useState } from 'react';
import { SidebarPanel } from './SidebarPanel';

interface ModernSidebarProps {}

type SidebarType = 'A' | 'B';

const ModernSidebar: React.FC<ModernSidebarProps> = () => {
  const [activeSidebar, setActiveSidebar] = useState<SidebarType>('A');

  return (
    <div className="flex h-full">
      <div className="absolute top-0 right-0 h-full w-110 z-40 ">
        <SidebarPanel isActive={activeSidebar === 'A'}>
          <DesktopSidebarA />
        </SidebarPanel>

        <SidebarPanel isActive={activeSidebar === 'B'}>
          <DesktopSidebarB />
        </SidebarPanel>

        <div className="absolute top-4 -left-13 flex flex-col gap-2">
          <button
            onClick={() => setActiveSidebar('A')}
            className={`
              w-10 h-10 rounded-l-md text-sm font-semibold transition-all
              border border-gray-200
              ${activeSidebar === 'A' 
                ? 'bg-white text-blue-600 shadow-xl z-50' 
                : 'bg-white text-blue-300 shadow-inner z-40'}
            `}
            title="Sidebar A"
          >
            A
          </button>

          <button
            onClick={() => setActiveSidebar('B')}
            className={`
              w-10 h-10 rounded-l-md text-sm font-semibold transition-all
              border border-gray-200
              ${activeSidebar === 'B' 
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
