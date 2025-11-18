class BrunchNav extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
     <style>
          .nav {
        display: flex;
        justify-content: space-around;
        position: fixed;
        bottom: 0;
        left: 50%; /* 화면 가운데 기준 */
        transform: translateX(-50%);
        inline-size: 100%;
        max-width: 460px;
        background-color: #ffffff;
        border-top: 1px solid #eee;
        align-items: center;
        padding: 0.75rem 0;
      }

      .nav-icon {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
        text-decoration: none;
        color: #666;
        font-size: 0.75rem;
      }
     </style>
      <nav class="nav">
        <!-- 홈 페이지 html -->
        <a href="/index.html" class="nav-icon" data-name="home">
          <img src="/assets/images/nav-icons/home.svg" alt="홈" />
          <span>홈</span>
        </a>
        <!-- 발견 페이지 html -->
        <a href="/src/features/search/search.html" class="nav-icon" data-name="search">
          <img src="/assets/images/nav-icons/search.svg" alt="발견" />
          <span>발견</span>
        </a>
        <!-- 글쓰기 페이지 html -->
        <a href="/src/features/write/write.html" class="nav-icon" data-name="write">
           <img src="/assets/images/nav-icons/write.svg" alt="글쓰기" />
          <span>글쓰기</span>
        </a>
        <!-- 내 서랍 페이지 html -->
        <a href="/src/features/mybox/mybox.html" class="nav-icon" data-name="mybox">
          <img src="/assets/images/nav-icons/mybox.svg" alt="내 서랍" />
          <span>내 서랍</span>
        </a>
      </nav>
    `;
  }
}

customElements.define('brunch-nav', BrunchNav);
