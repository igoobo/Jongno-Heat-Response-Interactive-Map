import { createContext, useContext, useState } from 'react';

interface CenterMarkerContextType {
  isCenterMarkerVisible: boolean;
  setCenterMarkerVisible: (visible: boolean) => void;
}

const CenterMarkerContext = createContext<CenterMarkerContextType | undefined>(undefined);

export const CenterMarkerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCenterMarkerVisible, setCenterMarkerVisible] = useState(true);

  return (
    <CenterMarkerContext.Provider value={{ isCenterMarkerVisible, setCenterMarkerVisible }}>
      {children}
    </CenterMarkerContext.Provider>
  );
};

export const useCenterMarker = () => {
  const context = useContext(CenterMarkerContext);
  if (!context) {
    throw new Error('useCenterMarker must be used within a CenterMarkerProvider');
  }
  return context;
};
