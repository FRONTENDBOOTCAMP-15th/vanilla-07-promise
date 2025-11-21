class BrunchNav extends HTMLElement {
  connectedCallback() {
    this.render();
    this.setActiveNav();
  }

  render() {
    this.innerHTML = `
     <style>
      .nav {
        display: flex;
        justify-content: space-around;
        position: fixed;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        inline-size: 100%;
        block-size:100px;
        max-width: 460px;
        background-color: #ffffff;
        border-top: 1px solid #eee;
        align-items: center;
        padding: 0.75rem 0;
      }

      .nav-icon, active {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.55rem;
        text-decoration: none;
        color: #666;
        font-size: 0.75rem;
      }

      .nav-icon.active span {
        color: #000; /* 활성화 시 텍스트 색상 변경 가능 */
      }
    </style>

    <nav class="nav">
      <a href="/index.html" class="nav-icon" data-name="home" data-icon="/assets/images/nav-icons/home.svg" data-icon-active="/assets/images/nav-icons/home-active.svg">
        <img src="/assets/images/nav-icons/home.svg" alt="홈" />
        <span>홈</span>
      </a>
      <a href="/src/features/search/search.html" class="nav-icon" data-name="search" data-icon="/assets/images/nav-icons/search.svg" data-icon-active="/assets/images/nav-icons/search-active.svg">
        <img src="/assets/images/nav-icons/search.svg" alt="발견" />
        <span>발견</span>
      </a>
      <a href="/src/features/write/write.html" class="nav-icon" data-name="write" data-icon="/assets/images/nav-icons/write.svg" data-icon-active="/assets/images/nav-icons/write-active.svg">
        <img src="/assets/images/nav-icons/write.svg" alt="글쓰기" />
        <span>글쓰기</span>
      </a>
      <a href="/src/features/mybox/mybox.html" class="nav-icon" data-name="mybox" data-icon="/assets/images/nav-icons/mybox.svg" data-icon-active="/assets/images/nav-icons/mybox-active.svg">
        <img src="/assets/images/nav-icons/mybox.svg" alt="내 서랍" />
        <span>내 서랍</span>
      </a>
    </nav>
    `;
  }

  setActiveNav() {
    const navLinks = this.querySelectorAll('.nav-icon');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
      const htmlLink = link as HTMLElement; // 여기서 HTMLElement로 단언
      const img = link.querySelector('img') as HTMLImageElement;
      // 모든 메뉴를 기본 이미지로 초기화
      img.src = htmlLink.dataset.icon || '';
      link.classList.remove('active');

      // 현재 페이지 메뉴만 활성화
      if (currentPath.includes(link.getAttribute('href') || '')) {
        link.classList.add('active');

        // data-name 속성을 기준으로 switch문 사용
        switch ((link as HTMLElement).dataset.name || '') {
          case 'home':
            img.src = '/assets/images/nav-icons/home-active.svg';
            break;
          case 'search':
            img.src = '/assets/images/nav-icons/search-active.svg';
            break;
          case 'write':
            img.src = '/assets/images/nav-icons/write-active.svg';
            break;
          case 'mybox':
            img.src = '/assets/images/nav-icons/mybox-active.svg';
            break;
          default:
            img.src = (link as HTMLElement).dataset.icon || '';
        }
      }
    });

  }
}
customElements.define('brunch-nav', BrunchNav);
