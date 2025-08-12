// components/KakaoMapLicense.tsx
const KakaoMapLicense = () => {
  return (
    <div style={{
      position: 'absolute',
      bottom: '5px',
      left: '5px',
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      padding: '6px 10px',
      borderRadius: '4px',
      fontSize: '11px',
      zIndex: 1000
    }}>
      Map data © Kakao Corp. | Powered by Kakao Maps API
    </div>
  );
};

export default KakaoMapLicense;
