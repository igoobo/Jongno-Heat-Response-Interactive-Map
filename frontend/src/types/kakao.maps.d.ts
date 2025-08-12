declare global {
  namespace kakao.maps {
    class LatLng {
      constructor(lat: number, lng: number);
      getLat(): number;
      getLng(): number;
    }

    interface MapOptions {
      center: LatLng;
      level: number;
    }

    class Map {
      constructor(container: HTMLElement, options: MapOptions);
      getLevel(): number;
      setLevel(level: number): void;
      getCenter(): LatLng;
      setCenter(latlng: LatLng): void;
    }

    namespace event {
      function addListener(target: any, type: string, callback: Function): void;
    }
  }

  interface Window {
    kakao: typeof kakao;
  }
}

export {};
