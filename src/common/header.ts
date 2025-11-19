class BrunchHeader extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <link rel="stylesheet" href="/assets/components/header.css" />
      <header class="header">
        <div class="logo">
          <a href="/index.html">
            <img src="/assets/images/logo.svg" alt="브런치스토리 로고" />
          </a>
        </div>

        <div class="search">
          <a href="/src/features/search/search.html">
            <img src="/assets/images/search.svg" alt="탐색 아이콘" />
          </a>
        </div>

        <div class="login-b">
          <a href="/src/features/login/login.html">
            <img src="/assets/images/start-btn.svg" alt="로그인 및 회원가입" />
          </a>
        </div>
      </header>
    `;
  }
}

customElements.define('brunch-header', BrunchHeader);

//   <!-- 로그인 후(추후 사용) -->
//   <div class="login-a hidden">
//     <img src="/assets/images/notice.svg" alt="알림" class="notice" />
//     <img src="/assets/images/login-picture.png" alt="프로필 이미지" class="profile" />
//   </div>
// </header>
