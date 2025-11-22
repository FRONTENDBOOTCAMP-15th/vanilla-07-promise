import { isUserLoggedIn } from '../features/utils/checklogin.ts';

let isSubscribed = false;

// 구독 버튼 및 구독자 수 렌더링
export function renderSubscribeSection(count: number, subscribed: boolean) {
  const countEl = document.querySelector('.subscribe-count')!;
  const btn = document.querySelector('.subscribe-btn')!;
  const img = btn.querySelector('img');

  countEl.textContent = String(count);

  if (img) {
    img.src = subscribed
      ? '/assets/images/detail/sub-A.svg' // 구독 중
      : '/assets/images/detail/sub-B.svg'; // 구독 안함
  }

  isSubscribed = subscribed;
}

// 구독 상태 UI 업데이트
function updateSubscribeUI(active: boolean) {
  const btn = document.querySelector('.subscribe-btn')!;
  const img = btn.querySelector('img');
  const countEl = document.querySelector('.subscribe-count')!;
  // eslint-disable-next-line prefer-const
  let count = parseInt(countEl.textContent ?? '0');

  if (img) {
    img.src = active
      ? '/assets/images/detail/sub-A.svg'
      : '/assets/images/detail/sub-B.svg';
  }

  countEl.textContent = String(active ? count + 1 : Math.max(0, count - 1));
}

// 구독 버튼 클릭 이벤트 등록
export function initSubscribeButton(): void {
  const btn = document.querySelector('.subscribe-btn');

  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!isUserLoggedIn()) {
      alert('로그인이 필요한 기능입니다.');
      location.href = '../login/login.html';
      return;
    }

    isSubscribed = !isSubscribed;
    updateSubscribeUI(isSubscribed);
  });
}
