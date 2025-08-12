interface SidebarPanelProps {
  isActive: boolean;
  children: React.ReactNode;
  className?: string;
}

export const SidebarPanel: React.FC<SidebarPanelProps> = ({ isActive, children, className }) => {
  return (
    <div
      className={`
        absolute top-0 left-0 w-full h-full p-4 bg-white
        transition-all duration-300
        ${isActive ? 'z-50' : 'z-40'}
        ${isActive ? '' : 'hidden'}
        ${className || ''}
      `}
    >
      {children}
    </div>
  );
};