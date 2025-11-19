class BrunchHeader extends HTMLElement {
  connectedCallback() {
    this.render();
    this.initEvents();
  }

  async render() {
    const accessToken = localStorage.getItem('accessToken');
    const isLoggedIn = !!accessToken;

    // 기본 프로필 이미지 URL
    let profileImageUrl = '/assets/images/default-user.png';

    // 로그인 상태일 때 사용자 정보 가져오기
    if (isLoggedIn) {
      try {
        const { api } = await import('../types/apiClient');
        const res = await api.get('/users/me');
        const user = res.data.data ?? res.data.item;
        if (user?.image) {
          profileImageUrl = user.image;
        }
      } catch (err) {
        console.error('프로필 이미지 로드 실패:', err);
        // 에러 발생 시 기본 이미지 사용
      }
    }

    this.innerHTML = `
      <link rel="stylesheet" href="/assets/components/header.css" />
      <header class="header">
        <!-- 로고 -->
        <div class="logo">
          <a href="/index.html">
            <img src="/assets/images/logo.svg" alt="브런치스토리 로고" />
          </a>
        </div>

        <!-- 검색 아이콘 -->
        <div class="search">
          <a href="/src/features/search/search.html">
            <img src="/assets/images/search.svg" alt="탐색 아이콘" />
          </a>
        </div>

        <!-- 로그인 전 -->
        <div class="login-b ${isLoggedIn ? 'hidden' : ''}">
          <a href="/src/features/login/login.html">
            <img src="/assets/images/start-btn.svg" alt="로그인 및 회원가입" />
          </a>
        </div>

        <!-- 로그인 후 -->
        <div class="login-a ${!isLoggedIn ? 'hidden' : ''}">
          <a href="/src/features/mypage/mypage.html">
            <img src="/assets/images/notice.svg" alt="알림" class="notice" />
            <img src="${profileImageUrl}" alt="프로필 이미지" class="profile" />
          </a>
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
