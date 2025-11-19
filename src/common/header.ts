class BrunchHeader extends HTMLElement {
  connectedCallback() {
    this.render();
    this.initEvents();
  }

  render() {
    const accessToken = localStorage.getItem('accessToken');
    const isLoggedIn = !!accessToken;
    this.innerHTML = `
      <link rel="stylesheet" href="/assets/components/header.css" />
      <header class="header">
        <!-- 로고 -->
        <div class="logo">
          <a href="메인 상단.html">
            <img src="/assets/images/logo.svg" alt="브런치스토리 로고" />
          </a>
        </div>

        <!-- 검색 아이콘 -->
        <div class="search">
          <a href="탐색 페이지.html">
            <img src="/assets/images/search.svg" alt="탐색 아이콘" />
          </a>
        </div>

        <!-- 로그인 전 -->
        <div class="login-b ${isLoggedIn? 'hidden' : ''}">
          <a href="로그인 화면.html">
            <img src="/assets/images/start-btn.svg" alt="로그인 및 회원가입" />
          </a>
        </div>

        <!-- 로그인 후 -->
        <div class="login-a ${!isLoggedIn? 'hidden' : ''}">
          <img src="/assets/images/notice.svg" alt="알림" class="notice" />
          <img src="/assets/images/login-picture.png" alt="프로필 이미지" class="profile" />
        </div>
      </header>
    `;
  }

  initEvents() {
    // localStorage 변경 감지 (다른 탭에서 로그인/로그아웃 시)
    window.addEventListener('storage', (e) => {
      if (e.key === 'accessToken') {
        this.render();
      }
    });

    // 커스텀 이벤트 리스너 (같은 페이지에서 로그인/로그아웃 시)
    window.addEventListener('loginStateChanged', () => {
      this.render();
    });
  }
}

customElements.define('brunch-header', BrunchHeader);

// 로그인/로그아웃 시 호출할 헬퍼 함수들
export function setLogin(token: string) {
  localStorage.setItem('accessToken', token);
  window.dispatchEvent(new Event('loginStateChanged'));
}

export function setLogout() {
  localStorage.removeItem('accessToken');
  window.dispatchEvent(new Event('loginStateChanged'));
}
