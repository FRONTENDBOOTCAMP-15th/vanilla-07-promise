import { getToken } from './checklogin';

// checkLogin.ts
function checkLogin() {
  const isLoggedIn = getToken();

  if (!isLoggedIn) {
    // 로그인 안 되어 있으면 경고창 표시
    alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');

    // 로그인 페이지로 이동
    window.location.href = '/src/features/login/login.html';
  }
}

// 페이지 로드 시 호출
window.addEventListener('DOMContentLoaded', () => {
  checkLogin();
});


