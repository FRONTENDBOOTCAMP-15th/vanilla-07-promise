import { RequestUserResults } from '../../utils/pages/searchFn.ts';

import type { Recent } from '../../../types/search-author-type/search-author-type.ts';

let currentPage = 1;
let isLoading = false;
let totalPages = 1;

//검색창 keyword 입력
const searchInput = document.querySelector('#search-input') as HTMLInputElement;
const main = document.querySelector('main')!;

//글 작가 버튼
const writeBtn = document.querySelector('.keyword-btn') as HTMLAnchorElement;
const authorBtn = document.querySelector('.author-btn') as HTMLAnchorElement;

// 글, 작가 버튼 클릭 시 이동
[writeBtn, authorBtn].forEach(btn => {
  btn.addEventListener('click', () => {
    const keyword = searchInput.value.trim();
    if (keyword) {
      saveRecentKeyword(keyword);
      btn.href = `${btn.href.split('?')[0]}?keyword=${encodeURIComponent(keyword)}`;
    }
  });
});

function getKeyword(): string {
  return new URLSearchParams(window.location.search).get('keyword') || '';
}

// 글목록 API 호출 (page 받도록 수정)

// 검색창 엔터 이벤트
searchInput?.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const keyword = searchInput.value.trim();
    if (!keyword) {
      window.location.href = window.location.origin + window.location.pathname;
      return;
    }
    goSearch(keyword);
  }
});

// URL 쿼리
const params = new URLSearchParams(window.location.search);
const urlKeyword = params.get('keyword');
if (searchInput && urlKeyword) {
  searchInput.value = decodeURIComponent(urlKeyword);
}

// 검색 결과 렌더링

async function renderResults(page: number) {
  if (isLoading) return;
  isLoading = true;

  const response = await RequestUserResults(page, getKeyword(), 10);
  const { item: results, pagination } = response;

  totalPages = pagination.totalPages;

  if (results.length === 0 && page === 1) {
    main.innerHTML = `<no-data-search></no-data-search>`;
    isLoading = false;
    return;
  }

  // 페이지 1일 때 UI 생성
  if (page === 1) {
    const resultRange = document.createElement('div');
    resultRange.className = 'result-range';

    const h3 = document.createElement('h3');
    h3.className = 'result-num';
    h3.textContent = `작가 검색 결과 검색 결과 ${response.pagination.total}건`;

    resultRange.appendChild(h3);
    main.appendChild(resultRange);

    const ul = document.createElement('ul');
    ul.className = 'result-list';
    main.appendChild(ul);
  }

  const ul = document.querySelector('.result-list')!;

  const keyword = getKeyword();

  // 게시물 append
  results.forEach(item => {
    // li
    const li = document.createElement('li');

    // article
    const article = document.createElement('article');
    article.className = 'profile-card';
    article.setAttribute('aria-label', '작가 정보');

    // figure
    const figure = document.createElement('figure');
    figure.className = 'profile-picture';

    const img = document.createElement('img');
    img.src = item.image || '/assets/images/search/defaultProfil.webp';
    img.alt = `${item.name} 프로필 사진`;
    img.className = 'avatar';
    figure.appendChild(img);

    // section
    const section = document.createElement('section');
    section.className = 'author-info';

    // h2 + a
    const h2 = document.createElement('h2');
    h2.className = 'name';

    h2.innerHTML = highlight(item.name, keyword);

    // desc
    const p = document.createElement('p');
    p.className = 'desc';

    if (item.extra.biography !== null) {
      p.innerHTML = highlight(
        item.extra.biography ?? '소개글이 없습니다.',
        keyword,
      );
    }

    // tags
    const ulTags = document.createElement('ul');
    ulTags.className = 'tags';
    ulTags.setAttribute('aria-label', '작가 태그 목록');

    if (item.extra.keyword !== null) {
      item.extra.keyword.forEach(tagText => {
        const tagLi = document.createElement('li');
        tagLi.className = 'tag';

        tagLi.innerHTML = highlight(tagText, keyword);
        ulTags.appendChild(tagLi);
      });
    }

    // 조립
    section.appendChild(h2);

    section.appendChild(p);

    section.appendChild(ulTags);

    article.appendChild(figure);
    article.appendChild(section);

    li.appendChild(article);

    li.addEventListener('click', () => {
      window.location.href = `/src/features/writerhome/writerhome?_id=${item._id}`;
    });

    ul.appendChild(li);
  });

  isLoading = false;
}

// 무한 스크롤
window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 200) {
    if (!isLoading && currentPage < totalPages) {
      currentPage++;
      renderResults(currentPage);
    }
  }
});

//검색이동
function goSearch(keyword: string) {
  saveRecentKeyword(keyword);
  window.location.href = `/src/features/search/search-author/search-author.html?keyword=${encodeURIComponent(keyword)}`;
}

// 최근검색어 저장
function saveRecentKeyword(keyword: string) {
  const listString = localStorage.getItem('recentList');
  const list: Recent[] = JSON.parse(listString || '[]');

  const filtered = list.filter(item => item.title !== keyword);
  const maxId = list.length > 0 ? Math.max(...list.map(item => item.id)) : 0;

  const newList: Recent[] = [{ id: maxId + 1, title: keyword }, ...filtered];

  // 최대 10개까지만 유지 (오래된 항목 제거)
  const limitedList = newList.slice(0, 10);

  localStorage.setItem('recentList', JSON.stringify(limitedList));
}

// 검색 단어 표기 하이라이트
function highlight(text: string, keyword: string): string {
  const withoutTags = text.replace(/<\/?[^>]+(>|$)/g, '');

  if (!keyword) return withoutTags;

  const pattern = new RegExp(`(${keyword})`, 'gi');
  return withoutTags.replace(pattern, `<mark class="highlight">$1</mark>`);
}

// start
renderResults(currentPage);
