import { getAxios } from '../../utils/axios';

interface ResultItem {
  _id: number;
  type: string;
  title: string;
  extra: {
    subtitle: string;
    align: string;
  };
  content: string;
  createdAt: string;
  updatedAt: string;
  image: string | null;
  views: number;
  user: {
    _id: number;
    name: string;
    image?: string | null; // 이미지가 없을 수도 있으니 optional
  };
  seller_id: number | null;
  bookmarks: number;
  likes: number;
  repliesCount: number;
  product: {
    image: string | null;
  };
}

interface ApiResponse {
  ok: number;
  item: ResultItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

type Recent = {
  id: number;
  title: string;
};


const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjIsInR5cGUiOiJzZWxsZXIiLCJuYW1lIjoiQUIiLCJlbWFpbCI6IncxQG1hcmtldC5jb20iLCJpbWFnZSI6Imh0dHBzOi8vcmVzLmNsb3VkaW5hcnkuY29tL2RkZWRzbHF2di9pbWFnZS91cGxvYWQvdjE3NjI4NDcwMTkvZmViYzE1LXZhbmlsbGEwNy1lY2FkL2NTNDlkYWRMbEYud2VicCIsImxvZ2luVHlwZSI6ImVtYWlsIiwiaWF0IjoxNzYzMzQ3NjYzLCJleHAiOjE3NjM0MzQwNjMsImlzcyI6IkZFQkMifQ.MaAwuU8BseRQNRSEBSpbiJJcNwm4fwPDzETfLsgyt40`;


// 글목록 API 호출
async function RequestResults(): Promise<ResultItem[]> {
  try {
    const axios = getAxios();
    const response = await axios.get<ApiResponse>(`/posts?type=brunch`, {
      headers: {
        Authorization: `Bearer ${token}`, // Bearer 토큰 형식
      },
    });
    return response.data.item;
  } catch (error: unknown) {
    if (error instanceof Error)
      console.error('검색 결과 가져오기 실패', error.message);
    else console.error('검색 결과 가져오기 실패', error);
    return [];
  }
}

const searchInput = document.querySelector('#search-input') as HTMLInputElement;
const main = document.querySelector('main')!;

// 검색창 엔터 이벤트
if (searchInput) {
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const keyword = searchInput.value.trim();
      if (!keyword) return;
      goSearch(keyword);
    }
  });
}

// URL 쿼리
const params = new URLSearchParams(window.location.search);
const keyword = params.get('keyword');
if (searchInput && keyword) searchInput.value = decodeURIComponent(keyword);

// 검색 결과 렌더링
async function renderResults() {
  const results: ResultItem[] = await RequestResults();

  if (results.length > 0) {
    const resultRange = document.createElement('div');
    resultRange.className = 'result-range';
    resultRange.innerHTML = `
      <h3 class="result-num" aria-live="polite">
        글 검색 결과 ${results.length}건
      </h3>
      <span class="result-sort">
        <a href="">정확도</a>
        <a href="">최신</a>
      </span>
    `;
    main.appendChild(resultRange);

    const ul = document.createElement('ul');
    main.appendChild(ul);

    results.forEach(item => {
      const li = document.createElement('li');

      li.innerHTML = `
        <strong class="result-title">${highlight(item.title, keyword || '')}</strong>
        <figure>
         ${item.user.image ? `<img src="${item.user.image}" alt="${item.title}" />` : ''}
          <figcaption>
            <p>${highlight(item.content || '', keyword || '')}</p>
            <address class="author" aria-label="작성자 정보">
              <time datetime="${item.createdAt}">${item.createdAt}</time>
              <span class="byline">by ${highlight(item.user.name, keyword || '')}</span>
            </address>
          </figcaption>
        </figure>
      `;

      li.addEventListener('click', () => {
        window.location.href = `/src/features/search/search-author?id=${item._id}`;
      });

      ul.appendChild(li);
    });
  } else {
    main.innerHTML = `<no-data-search></no-data-search>`;
  }
}

renderResults(); // 렌더링 호출

// 검색 이동
function goSearch(keyword: string) {
  if (!keyword.trim()) return;
  saveRecentKeyword(keyword);
  window.location.href = `/src/features/search/search-result/search-result.html?keyword=${encodeURIComponent(keyword)}`;
}

// 로컬스토리지 최근검색어 저장
function saveRecentKeyword(keyword: string) {
  const listString = localStorage.getItem('recentList');
  const list: Recent[] = JSON.parse(listString || '[]');

  const filtered = list.filter(item => item.title !== keyword);
  const maxId = list.length > 0 ? Math.max(...list.map(item => item.id)) : 0;

  const newList: Recent[] = [{ id: maxId + 1, title: keyword }, ...filtered];
  localStorage.setItem('recentList', JSON.stringify(newList));
}

// 검색어 하이라이트
function highlight(text: string, keyword: string): string {
  if (!keyword) return text;
  const pattern = new RegExp(`(${keyword})`, 'gi');
  return text.replace(pattern, `<mark class="highlight">$1</mark>`);
}
