// ===== home.ts (trending + top-author 통합) =====

// Axios import는 한 번만
import { getAxios } from '../utils/axios';
const axios = getAxios();

/* -----------------------------
   Trending Brunch 영역
----------------------------- */
interface Post {
  _id: string;
  title: string;
  content: string;
  image?: string;
  user?: {
    name: string;
    image?: string;
  };
}

// HTML 태그 제거 함수
function stripHtmlTags(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || '';
}

// HTML 문자열 생성
function createPostElement(post: Post, index: number): string {
  const imageUrl =
    post.user?.image || post.image || '/assets/images/mybox-icons/no-img.svg';
  const cleanContent = stripHtmlTags(post.content).slice(0, 40);

  return `
    <li class="trending-book">
      <div>${index + 1}</div>
      <div class="trending-content">
         <h2>
        <a href="/src/features/detail/detail.html?_id=${post._id}">
          ${post.title}
        </a>
      </h2>
        <span>by ${post.user?.name}</span>
        <a href="/src/features/detail/detail.html?_id=${post._id}">
          ${cleanContent}...
        </a>
      </div>
      <img class="book" src="${imageUrl}" alt="${post.title}" />
    </li>
  `;
}

// 인기 브런치 Top10
async function renderTrendingList() {
  try {
    const res = await axios.get('/posts', {
      params: {
        type: 'brunch',
        sort: JSON.stringify({ views: -1 }),
      },
    });

    const posts = res.data.item.slice(0, 10);
    const listEl = document.querySelector('.trending-list');
    if (!listEl) return;

    listEl.innerHTML = posts
      .map((post: Post, index: number): string =>
        createPostElement(post, index),
      )
      .join('');
  } catch (error: unknown) {
    console.error('트렌딩 브런치 불러오기 실패:', error);
  }
}

/* -----------------------------
   Top Authors 영역
----------------------------- */
type Writer = {
  _id: number;
  name: string;
  image: string;
  extra?: {
    job?: string;
    biography?: string;
  };
  bookmarkedBy: {
    users: number;
  };
};

// Top Writers 렌더링
async function renderTopWriters() {
  const container = document.getElementById('author-list');
  if (!container) return;

  try {
    const response = await axios.get('/users', {
      params: {
        sort: JSON.stringify({ 'bookmarkedBy.users': -1 }),
      },
    });

    const writers: Writer[] = response.data.item.slice(0, 4);

    writers.forEach(writer => {
      const imageSrc = writer.image;

      const card = document.createElement('div');
      card.className = 'author-card';
      card.innerHTML = `
        <a href="/src/features/writerhome/writerhome.html">
          <img src="${imageSrc}" alt="${writer.name}" class="profile" />
        </a>
        <a href="/src/features/writerhome/writerhome.html">
          <h3>${writer.name}</h3>
        </a>
        <a href="/src/features/writerhome/writerhome.html">
          <p class="job">${writer.extra?.job || ''}</p>
        </a>
        <a href="/src/features/writerhome/writerhome.html">
          <p class="prev">${(writer.extra?.biography || '').replace(/\n/g, '<br />')}</p>
        </a>
      `;
      container.appendChild(card);
    });
  } catch (error: unknown) {
    console.error('탑 구독작가 목록 불러오기 실패:', error);
  }
}

/* -----------------------------
   실행
----------------------------- */
// DOMContentLoaded에서 두 함수 모두 실행하면 안정적
document.addEventListener('DOMContentLoaded', () => {
  renderTrendingList();
  renderTopWriters();
});
