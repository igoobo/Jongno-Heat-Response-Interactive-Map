interface Window {
  kakao: {
    maps: {
      load: (callback: () => void) => void;
      LatLng: new (lat: number, lng: number) => {
        getLat(): number;
        getLng(): number;
      };
      Map: new (container: HTMLElement, options: any) => {
        getLevel(): number;
        setLevel(level: number): void;
        getCenter(): any; // LatLng
        setCenter(latlng: any): void; // LatLng
        panTo(latlng: any): void; // LatLng
      };
      Marker: new (options: { position: any; title?: string; map?: any | null }) => {
        setMap(map: any | null): void;
      };
      InfoWindow: new (options: { content: string; removable?: boolean; zIndex?: number }) => {
        open(map: any, marker?: any): void;
        close(): void;
      };
      Polygon: new (options: any) => any;
      event: {
        addListener: (target: any, type: string, callback: Function) => void;
        removeListener: (target: any, type: string, callback: Function) => void;
      };
    };
  };
}