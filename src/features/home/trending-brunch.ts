// Axios 불러오기
import { getAxios } from '../utils/axios';
const axios = getAxios();

//Post 데이터 타입 정의
interface Post {
  _id: string;
  title: string;
  content: string;
  image?: string; //8번만 user가 없어서 밖에도 배치
  user?: {
    name: string;
    image?: string;
  };
}

// HTML 태그 제거 함수 (8번 content에 HTML태그 포함으로 인해 생기는 오류 해결 함수)
function stripHtmlTags(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || '';
}

// HTML 문자열로 반환
function createPostElement(post: Post, index: number): string {
  const imageUrl =
    post.user?.image || post.image || '/assets/images/trending-10.png';
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
  //axios불러오기
  const res = await axios.get('/posts', {
    params: {
      type: 'brunch',
      sort: JSON.stringify({ views: -1 }), //view 내림차순
    },
  });

  const posts = res.data.item.slice(0, 10); //10개까지
  const listEl = document.querySelector('.trending-list');
  if (!listEl) return;

  //배열을 HTML로 바꿔서 리스트에 넣기
  listEl.innerHTML = posts
    .map((post: Post, index: number): string => createPostElement(post, index))
    .join(''); //,없이 문자열 붙여주기
}

// 페이지 로드 시 실행
renderTrendingList();
