import { isUserLoggedIn } from '../features/utils/checklogin.ts';

let isLiked = false;

function updateLikeUI(active: boolean) {
  const heartBtn = document.getElementById('heartBtn')!;
  const img = heartBtn.querySelector('img')!;
  const countEl = document.querySelector('.like-count')!;
  let count = parseInt(countEl.textContent ?? '0');

  if (active) {
    img.src = '/assets/images/detail/heart-a.svg'; // ❤️ 좋아요 상태
    count += 1;
  } else {
    img.src = '/assets/images/detail/heart.svg'; // 🤍 기본 상태
    count = Math.max(0, count - 1);
  }

  countEl.textContent = String(count);
}

// 좋아요 버튼 초기화 및 이벤트 등록
export function initLikeButton() {
  const heartBtn = document.getElementById('heartBtn');

  heartBtn?.addEventListener('click', async () => {
    if (!isUserLoggedIn()) {
      alert('로그인이 필요한 기능입니다.');
      location.href = '../login/login.html';
      return;
    }

    // 좋아요 상태 토글
    isLiked = !isLiked;
    updateLikeUI(isLiked);
  });
}
