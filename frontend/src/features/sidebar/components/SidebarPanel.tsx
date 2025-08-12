interface SidebarPanelProps {
  isActive: boolean;
  children: React.ReactNode;
}

export const SidebarPanel: React.FC<SidebarPanelProps> = ({ isActive, children }) => {
  return (
    <div
      className={`
        absolute top-0 left-0 w-full h-full p-4 bg-white border-l
        transition-all duration-300
        ${isActive ? 'z-50' : 'z-40'}
      `}
    >
      {children}
    </div>
  );
};