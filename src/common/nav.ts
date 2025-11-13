class BrunchNav extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <link rel="stylesheet" href="/assets/components/nav.css" />
      <nav class="nav">
      <!-- 홈 페이지 html넣기-->
        <a href="home.html" class="nav-icon" data-name="home">
          <img src="/assets/images/home.svg" alt="홈" />
          <span>홈</span>
        </a>
      <!-- 발견 페이지 html넣기-->
        <a href="search.html" class="nav-icon" data-name="search">
          <img src="/assets/images/nav.search.svg" alt="발견" />
          <span>발견</span>
        </a>
      <!--글쓰기 페이지 html넣기-->
        <a href="write.html" class="nav-icon" data-name="write">
          <img src="/assets/images/write.svg" alt="글쓰기" />
          <span>글쓰기</span>
        </a>
        <!--내 서랍 페이지 html넣기-->
        <a href="mybox.html" class="nav-icon" data-name="mybox">
          <img src="/assets/images/mybox.svg" alt="내 서랍" />
          <span>내 서랍</span>
        </a>
      </nav>
    `;
  }
}
customElements.define('brunch-nav', BrunchNav);
