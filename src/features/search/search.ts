import type { UserItem } from '../../types/search-author-type/search-author-type';
import { RequestUserResults } from '../utils/pages/searchFn';

type Recent = {
  id: number;
  title: string;
};

// 초기값
const initialRecentList: Recent[] = [];

const STORAGE_KEY = 'recentList';
const recentUl = document.querySelector('.recent-keyword') as HTMLUListElement;
const searchInput = document.querySelector('#search-input') as HTMLInputElement;

// 로컬스토리지 기준으로 초기 리스트 가져오기
const recentList = getRecentList();

//추천 작가 화면 렌더링
renderAuthorSection();

// 최근검색어 화면 렌더링
recentList.forEach(item => {
  recentUl?.appendChild(createRow(item));
});

if (searchInput) {
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const keyword = searchInput.value.trim();
      if (keyword === '') {
        goToSearchResult('');
        return;
      }

      saveRecentKeyword(keyword);
      goToSearchResult(keyword);
    }
  });
}

/**
 *
 * @param keyword
 */
// 검색 결과 페이지 이동
function goToSearchResult(keyword: string) {
  window.location.href = `/src/features/search/search-result/search-result.html?keyword=${encodeURIComponent(keyword)}`;
}

/**
 *
 * @param keyword
 */
// localStorage에 검색어 저장
function saveRecentKeyword(keyword: string) {
  const list = getRecentList();

  const filtered = list.filter(item => item.title !== keyword);
  const maxId = list.length > 0 ? Math.max(...list.map(item => item.id)) : 0;
  const newList: Recent[] = [{ id: maxId + 1, title: keyword }, ...filtered];
  localStorage.setItem('recentList', JSON.stringify(newList));
}

/**
 * 로컬스토리지에서 recentList 가져오기
 * 없으면 초기값 저장 후 반환
 */
function getRecentList(): Recent[] {
  const localRecentList = localStorage.getItem(STORAGE_KEY);

  if (localRecentList === null) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialRecentList));
    return [...initialRecentList];
  } else {
    return JSON.parse(localRecentList) as Recent[];
  }
}

/**
 * 최근 검색어 <li> 요소를 생성
 * @param item Recent 객체
 * @returns HTMLLIElement
 */

function createRow(item: Recent): HTMLLIElement {
  const li = document.createElement('li');
  li.dataset.no = item.id.toString();

  // 접근성 설정
  li.setAttribute('role', 'link');
  li.setAttribute('tabindex', '0');

  // span (title)
  const titleSpan = document.createElement('span');
  titleSpan.className = 'recent-title';
  titleSpan.textContent = item.title;

  // button
  const deleteBtn = document.createElement('button');
  deleteBtn.setAttribute('aria-label', `${item.title} 검색어 삭제`);

  // img
  const img = document.createElement('img');
  img.src = '/assets/images/search/dtButton.svg';
  img.alt = '최근검색어 삭제버튼';

  deleteBtn.appendChild(img);

  // li 내부 구성
  li.appendChild(titleSpan);
  li.appendChild(deleteBtn);

  // 이동 이벤트
  li.addEventListener('click', () => {
    goToSearchResult(item.title);
  });

  li.addEventListener('keydown', e => {
    if (e.key === 'Enter') goToSearchResult(item.title);
  });

  // 삭제 버튼 이벤트
  deleteBtn.addEventListener('click', e => {
    e.stopPropagation();
    deleteRecent(item.id, li);
  });

  return li;
}

async function renderAuthorSection() {
  try {
    const response = await RequestUserResults(); // 실제 API 호출
    const { ok, item }: { ok: number; item: UserItem[] } = response;

    if (ok && item.length > 0) {
      // 랜덤 1개 선택 (item 길이에 맞게)
      const randomIndex = Math.floor(Math.random() * item.length);
      const author = item[randomIndex];

      // 기존 a.author 제거 (있으면)
      const section = document.querySelector('.keyword-group');
      if (!section) return;
      const oldAuthor = section.querySelector('a.author');
      if (oldAuthor) oldAuthor.remove();

      // 새로운 a.author 생성
      const a = document.createElement('a');
      a.href = `../writerhome/writerhome?_id=${author._id}`;
      a.className = 'author';

      // p 요소
      const p = document.createElement('p');
      p.innerHTML =
        author.extra.biography || '작가님이 소개 글을 미등록했습니다';

      // ul.tags 생성
      const ul = document.createElement('ul');
      ul.className = 'tags';
      author.extra.keyword.forEach((kw: string) => {
        const li = document.createElement('li');
        li.textContent = kw;
        ul.appendChild(li);
      });

      // a.author에 p와 ul 추가
      a.appendChild(p);
      a.appendChild(ul);

      // section 안에 삽입
      section.appendChild(a);
    }
  } catch (err) {
    console.error('작가 섹션 로드 실패', err);
  }
}

// 최근 검색어 삭제
function deleteRecent(id: number, liElement: HTMLLIElement) {
  liElement.remove();
  const currentList = getRecentList();
  const updatedList = currentList.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
}
