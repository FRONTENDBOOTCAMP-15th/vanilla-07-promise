// brunch-header.ts
class BrunchHeader extends HTMLElement {
  connectedCallback() {
    this.render();
    this.initEvents();
  }

  async render() {
    const accessToken = sessionStorage.getItem('accessToken');

    // user 정보 가져오기
    const userString = sessionStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const isLoggedIn = !!accessToken;

    // 기본 프로필 이미지
    let profileImageUrl = '/assets/images/search/defaultProfil.webp';
    if (isLoggedIn && user?.image) {
      profileImageUrl = user.image;
    }

    // 로그인 전/후 HTML
    const loginBeforeHTML = `
      <div class="login-b">
        <button>시작하기</button>
      </div>
    `;

    const loginAfterHTML = `
      <div class="login-a">
        <a href="/src/features/mypage/mypage.html">
          <img src="/assets/images/notice.svg" alt="알림" class="notice" />
        </a>
      </div>
      <div class="login-profile">
        <a href="/src/features/mypage/mypage.html">
          <img src="${profileImageUrl}" alt="프로필 이미지" class="profile" />
        </a>
      </div>
    `;

    this.innerHTML = `
      <style>
                /* 모바일 화면 */
          @import url('/assets/css/base/global.css');
          body {
            margin: 0 auto;
            max-width: var(--body-width);
          }

          .header {
            position: fixed;
            top: 0;
            left: 50%;
            transform: translateX(-50%); /* 좌우 중앙 이동 */
            inline-size: 100%;
            max-inline-size: var(--body-width);
            z-index: 1000;
            display: flex;
            background-color: var(--color-white);

            justify-content: space-between;
            align-items: center;
            block-size: 4.125em;
            border-bottom: 0.0625em solid var(--color-border);

            .search-group {
              display: flex;
              align-items: center;
              gap: 10px;

              img {
                display: block;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                object-fit: cover;
                flex-shrink: 0;
              }

              .login-b {
                vertical-align: middle;
                button {
                  inline-size: 5.625em;
                  block-size: 2.1875em;
                  padding: 0.25em 0.8125em;

                  background-color: #231f20;
                  color: var(--color-white);
                  border: 1px solid;
                  border-radius: 15px;
                }
              }
            }
          }

      </style>

      <header class="header">
        <div class="logo">
          <a href="/index.html"><img src="/assets/images/logo.svg" alt="브런치스토리 로고" /></a>
        </div>

        <div class="search-group">
          <div class="search">
            <a href="/src/features/search/search.html">
              <img src="/assets/images/search.svg" alt="탐색 아이콘" />
            </a>
          </div>
          ${isLoggedIn ? loginAfterHTML : loginBeforeHTML}
        </div>
      </header>
    `;

    // 버튼 클릭 이벤트 등록 (render 후)
    const loginButton =
      this.querySelector<HTMLButtonElement>('.login-b button');
    if (loginButton) {
      loginButton.addEventListener('click', () => {
        window.location.href = '/src/features/login/login.html';
      });
    }
  }

  initEvents() {
    window.addEventListener('storage', e => {
      if (e.key === 'accessToken') this.render();
    });

    window.addEventListener('loginStateChanged', () => {
      this.render();
    });
  }
}

customElements.define('brunch-header', BrunchHeader);