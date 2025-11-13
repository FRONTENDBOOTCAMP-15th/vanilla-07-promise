class BrunchHeader extends HTMLElement {
  connectedCallback() {
    this.render();
    this.initEvents();
  }

  render() {
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
        <div class="login-b">
          <a href="로그인 화면.html">
            <img src="/assets/images/start-btn.svg" alt="로그인 및 회원가입" />
          </a>
        </div>

        <!-- 로그인 후 -->
        <div class="login-a hidden">
          <img src="/assets/images/notice.svg" alt="알림" class="notice" />
          <img src="/assets/images/login-picture.png" alt="프로필 이미지" class="profile" />
        </div>
      </header>
    `;
  }

  initEvents() {
    const loginBefore = this.querySelector('.login-b') as HTMLElement;
    const loginAfter = this.querySelector('.login-a') as HTMLElement;

    let isLoggedIn = false;

    function toggleLogin() {
      isLoggedIn = !isLoggedIn;
      loginBefore.classList.toggle('hidden', isLoggedIn);
      loginAfter.classList.toggle('hidden', !isLoggedIn);
    }

    // 로그인 변환 테스트: 3초 후 로그인 전환
    //추후 변경 예정
    setTimeout(toggleLogin, 3000);
  }
}

customElements.define('brunch-header', BrunchHeader);
