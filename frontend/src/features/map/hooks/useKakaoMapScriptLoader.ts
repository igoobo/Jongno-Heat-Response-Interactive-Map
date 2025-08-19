import { useEffect, useState } from 'react';

export const useKakaoMapScriptLoader = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState<string | null>(null);

  useEffect(() => {
    const loadScript = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.getElementById('kakao-map-script')) {
          console.log('Kakao Map script already exists.');
          setScriptLoaded(true);
          resolve();
          return;
        }

        console.log('Starting to load Kakao Map script...');
        const KAKAO_MAP_KEY = import.meta.env.VITE_KAKAO_MAP_JS_API_KEY;
        const script = document.createElement('script');
        script.id = 'kakao-map-script';
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&autoload=false`;
        script.onload = () => {
          console.log('Kakao Map script loaded successfully.');
          setScriptLoaded(true);
          resolve();
        };
        script.onerror = () => {
          console.error('Kakao Map script load failed.');
          setScriptError('Kakao Map script load failed');
          reject('Kakao Map script load failed');
        };
        document.head.appendChild(script);
      });
    };

    loadScript();
  }, []);

  return { scriptLoaded, scriptError };
};
