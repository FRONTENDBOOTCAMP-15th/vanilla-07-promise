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

    // 로그인 전 HTML
    const loginBeforeHTML = `
    <div class="login-b">
     <button>시작하기</button>
    </div>
  `;

    // 로그인 후 HTML
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
      @import url(../css/base/global.css);
      body {
        margin: 0 auto;
        max-width: var(--body-width);
      }

      .header {
        position: fixed;
        top: 0;
        left: 50%;
        transform: translateX(-50%); /* 좌우 중앙 이동 */
        width: var(--body-width);
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
      <!-- 로고 -->
      <div class="logo">
        <a href="/index.html">
          <img src="/assets/images/logo.svg" alt="브런치스토리 로고" />
        </a>
      </div>

      <!-- 검색 아이콘 -->
      
      <div class="search-group">
        <div class="search">
          <a href="/src/features/search/search.html">
            <img src="/assets/images/search.svg" alt="탐색 아이콘" />
          </a>
        </div>
        
        <!-- 로그인 상태에 따라 렌더링 -->
        ${isLoggedIn ? loginAfterHTML : loginBeforeHTML}
      
        </div>
    </header>










  `;
  }

  initEvents() {
    // localStorage 변경 감지 (다른 탭에서 로그인/로그아웃 시)
    window.addEventListener('storage', e => {
      if (e.key === 'accessToken') {
        this.render();
      }
    });

    // 커스텀 이벤트 리스너 (같은 페이지에서 로그인/로그아웃 시)
    window.addEventListener('loginStateChanged', () => {
      this.render();
    });

    // 프로필 이미지 변경 이벤트 리스너
    window.addEventListener('profileImageChanged', () => {
      this.updateProfileImage();
    });
  }

  // 프로필 이미지만 업데이트하는 메서드
  async updateProfileImage() {
    const profileImg = this.querySelector('.profile') as HTMLImageElement;
    if (!profileImg) return;

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    try {
      const { api } = await import('../types/apiClient');
      const res = await api.get('/users/me');
      const user = res.data.data ?? res.data.item;
      if (user?.image) {
        profileImg.src = user.image;
      } else {
        profileImg.src = '/assets/images/default-user.png';
      }
    } catch (err) {
      console.error('프로필 이미지 업데이트 실패:', err);
    }
  }
}

// customElements.define('brunch-header', BrunchHeader);

// 로그인/로그아웃 시 호출할 헬퍼 함수들
export function setLogin(token: string) {
  localStorage.setItem('accessToken', token);
  window.dispatchEvent(new Event('loginStateChanged'));
}

export function setLogout() {
  localStorage.removeItem('accessToken');
  window.dispatchEvent(new Event('loginStateChanged'));
}

customElements.define('brunch-header', BrunchHeader);
