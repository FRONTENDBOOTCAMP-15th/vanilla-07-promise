import homeImage from '/assets/images/home.svg';
import searchImage from '/assets/images/nav.search.svg';
import writeImage from '/assets/images/write.svg';
import myboxImage from '/assets/images/mybox.svg';

class BrunchNav extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
     
      <nav class="nav">
      <!-- 홈 페이지 html넣기-->
        <a href="home.html" class="nav-icon" data-name="home">
          <img src="${homeImage}" alt="홈" />
          <span>홈</span>
        </a>
      <!-- 발견 페이지 html넣기-->
        <a href="search.html" class="nav-icon" data-name="search">
          <img src="${searchImage}" alt="발견" />
          <span>발견</span>
        </a>
      <!--글쓰기 페이지 html넣기-->
        <a href="write.html" class="nav-icon" data-name="write">
          <img src="${writeImage}" alt="글쓰기" />
          <span>글쓰기</span>
        </a>
        <!--내 서랍 페이지 html넣기-->
        <a href="mybox.html" class="nav-icon" data-name="mybox">
          <img src="${myboxImage}" alt="내 서랍" />
          <span>내 서랍</span>
        </a>
      </nav>
    `;
  }
}
customElements.define('brunch-nav', BrunchNav);
