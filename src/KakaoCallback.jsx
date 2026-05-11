import { useEffect } from 'react';

const KakaoCallback = ({ setKakaoUser }) => {

  useEffect(() => {
    // 1. URL에서 인가 코드(code) 추출 (순수 자바스크립트 방식)
    const code = new URL(window.location.href).searchParams.get('code');

    if (code) {
      console.log("인가 코드 획득 성공:", code);
      
      // 2. 로그인 성공 처리
      if (setKakaoUser) {
        setKakaoUser({ loggedIn: true }); 
      }
      
      alert("카카오 연동에 성공했습니다!");
      
      // 3. 페이지 이동 (라우터 대신 브라우저 기본 기능 사용)
      window.location.href = '/'; 
    } else {
      window.location.href = '/';
    }
  }, [setKakaoUser]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      color: 'white', 
      background: '#07070f' 
    }}>
      <p>카카오 로그인 처리 중...</p>
    </div>
  );
};

export default KakaoCallback;