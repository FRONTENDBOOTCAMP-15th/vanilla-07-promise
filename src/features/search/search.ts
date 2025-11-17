type Recent = {
  id: number;
  title: string;
};

// 초기값
const initialRecentList: Recent[] = [
  { id: 1, title: 'JavaScript 공부' },
  { id: 2, title: 'React 공부' },
  { id: 3, title: '바닐라 프로젝트' },
  { id: 4, title: 'TypeScript 공부' },
  { id: 5, title: 'Final 프로젝트' },
  { id: 6, title: 'Final 프로젝트' },
  { id: 7, title: 'Final 프로젝트' },
  { id: 8, title: 'Final 프로젝트' },
  { id: 9, title: 'Final 프로젝트' },
  { id: 10, title: 'Final 프로젝트' },
  { id: 11, title: 'Final 프로젝트' },
];

const STORAGE_KEY = 'recentList';
const recentUl = document.querySelector('.recent-keyword') as HTMLUListElement;
const searchInput = document.querySelector('#search-input') as HTMLInputElement;

// 로컬스토리지 기준으로 초기 리스트 가져오기
const recentList = getRecentList();

// 화면에 렌더링
recentList.forEach(item => {
  recentUl?.appendChild(createRow(item));
});

if (searchInput) {
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const keyword = searchInput.value.trim();
      if (keyword === '') return;

      saveRecentKeyword(keyword);
    }
  });
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

  // li를 클릭하면 이동하도록
  li.setAttribute('role', 'link');
  li.setAttribute('tabindex', '0');

  // li 내부 내용
  li.innerHTML = `
    <span class="recent-title">${item.title}</span>
    <button aria-label="${item.title} 검색어 삭제">
      <img src="../../../assets/images/search/dtButton.svg" alt="최근검색어 삭제버튼">
    </button>
  `;

  // li 클릭 시 이동
  li.addEventListener('click', () => {
    window.location.href = `/src/features/search/search-result/search-result.html?keyword=${encodeURIComponent(item.title)}`;
  });

  // Enter 키 눌렀을 때도 이동
  li.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      window.location.href = `/src/features/search/search-result/search-result.html?keyword=${encodeURIComponent(item.title)}`;
    }
  });

  // 삭제 버튼 이벤트
  const button = li.querySelector('button')!;
  button.addEventListener('click', e => {
    e.stopPropagation(); // li 클릭 막기
    deleteRecent(item.id, li);
  });

  return li;
}

// 최근 검색어 삭제
function deleteRecent(id: number, liElement: HTMLLIElement) {
  liElement.remove();
  const currentList = getRecentList();
  const updatedList = currentList.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
}
