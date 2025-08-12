// stores/useMapStore.ts
import { create } from 'zustand';

interface MapStore {
  map: any;
  setMap: (map: any) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  map: null,
  setMap: (map) => set({ map }),
}));
