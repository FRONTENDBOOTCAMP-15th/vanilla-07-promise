import { getAxios } from '../utils/axios';

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

// HTML에서 id가 author-list인 요소 가져와 사용
async function renderTopWriters() {
  const container = document.getElementById('author-list');
  if (!container) return;

  try {
    // api호출하여 북마크 기준으로 내림차순
    const axiosInstance = getAxios();
    const response = await axiosInstance.get('/users', {
      params: {
        sort: JSON.stringify({ 'bookmarkedBy.users': -1 }),
      },
    });
    // 4개만 출력
    const writers: Writer[] = response.data.item.slice(0, 4);

    // HTML 생성
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
    // 오류 메시지 출력
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('탐 구독작가 목록 불러오기 실패:', error.message);
    } else {
      console.error('탑 구독작가 목록 불러오기 실패: 알 수 없는 오류', error);
    }
  }
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', renderTopWriters);
