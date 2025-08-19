interface Window {
  kakao: {
    maps: {
      load: (callback: () => void) => void;
      LatLng: new (lat: number, lng: number) => {
        getLat(): number;
        getLng(): number;
      };
      Map: new (container: HTMLElement, options: any) => { // options: MapOptions
        getLevel(): number;
        setLevel(level: number): void;
        getCenter(): any; // LatLng
        setCenter(latlng: any): void; // LatLng
        panTo(latlng: any): void; // LatLng
      };
      Marker: new (options: { position: any; title?: string; map?: any | null }) => { // position: LatLng, map: Map
        setMap(map: any | null): void; // map: Map
      };
      InfoWindow: new (options: { content: string; removable?: boolean; zIndex?: number }) => {
        open(map: any, marker?: any): void; // map: Map, marker: Marker
        close(): void;
      };
      Polygon: new (options: any) => any; // options: PolygonOptions
      event: {
        addListener: (target: any, type: string, callback: Function) => void;
        removeListener: (target: any, type: string, callback: Function) => void;
      };
    };
  };
}