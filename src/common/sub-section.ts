/*ts에서 불러올 때
import {
  renderSubscribeSection,
  initSubscribeButton,
} from ''../../common/sub-section'';
 */

/*
HTML구조
<div class="subscribe-section">
  <button class="subscribe-btn">
    <img src="/assets/images/detail/sub-A.png" />
  </button>
  <span class="subscribe-count">0</span>
</div>
*/

//기본값
let isSubscribed = false;

// 구독 버튼 및 구독자 수
export function renderSubscribeSection(userId: number, count: number) {
  void userId; //임시
  const countEl = document.querySelector('.subscribe-count')!;
  const btn = document.querySelector('.subscribe-btn')!;
  countEl.textContent = String(count);

  const img = btn.querySelector('img');
  if (img) img.src = '/assets/images/detail/sub-A.png';
}

// 구독 상태 업데이트
function updateSubscribeUI(active: boolean) {
  const btn = document.querySelector('.subscribe-btn')!;
  const img = btn.querySelector('img');
  const countEl = document.querySelector('.subscribe-count')!;
  // eslint-disable-next-line prefer-const
  let count = parseInt(countEl.textContent ?? '0');

  if (active) {
    if (img) img.src = '/assets/images/detail/sub-B.png';
    countEl.textContent = String(count + 1);
  } else {
    if (img) img.src = '/assets/images/detail/sub-A.png';
    countEl.textContent = String(Math.max(0, count - 1));
  }
}

// 구독 버튼 클릭 이벤트 등록
export function initSubscribeButton(postId: number) {
  void postId;
  const btn = document.querySelector('.subscribe-btn');
  btn?.addEventListener('click', async () => {
    const isLoggedIn = false;

    //비로그인 시
    if (!isLoggedIn) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }
    //구독처리
    if (isSubscribed) return;
    isSubscribed = true;
    updateSubscribeUI(true);
  });
}
