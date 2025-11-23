import { getAxios } from '../features/utils/axios.ts';
import { getToken, isUserLoggedIn } from '../features/utils/checklogin.ts';

const axios = getAxios();

interface subItem {
  _id: number;
  target_id: number;
  user: {
    _id: number;
  };
}

let isSubscribed = false;
let subId: number | null = null;

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

// 구독 추가
async function postsubData(targetId: number) {
  const token = getToken();
  if (!token) throw new Error('로그인이 필요합니다');
  try {
    const { data } = await axios.post(
      '/bookmarks/user',
      { target_id: targetId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log(data);
    subId = data.item._id;
    return data;
  } catch (err) {
    console.log(err);
  }
}

// 구독 삭제
async function delsubData() {
  const token = getToken();
  if (!token) throw new Error('로그인이 필요합니다');
  if (!subId) return;

  try {
    const { data } = await axios.delete(`/bookmarks/${subId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(data);
    subId = null;
    return data;
  } catch (err) {
    console.log(err);
  }
}

//  현재 게시글이 구독 상태인지 확인

async function loadInitialsubState(targetId: number) {
  const token = getToken();
  if (!token) return;

  try {
    const { data } = await axios.get('/bookmarks/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const list: subItem[] = data.item ? data.item : [];

    const found = list.find(b => b.user._id === targetId);

    if (found) {
      isSubscribed = true;
      subId = found._id;

      const btn = document.querySelector('.subscribe-btn')!;
      const img = btn.querySelector('img');

      if (img) {
        img.src = '/assets/images/detail/sub-A.svg';
      }
      // updateSubscribeUI(true);
    }
  } catch (err) {
    console.log(err);
  }
}

// 구독 버튼 클릭 이벤트 등록
export async function initSubscribeButton(
  targetId: number,
  subNumber: number = 0,
  subStatus: boolean = false,
) {
  // renderSubscribeSection(subNumber, subStatus);
  await loadInitialsubState(targetId);


  const btn = document.querySelector('.subscribe-btn') as HTMLElement;

  if (!btn) return;

  btn.onclick = async () => {
    if (!isUserLoggedIn()) {
      alert('로그인이 필요한 기능입니다.');
      location.href = '../login/login.html';
      return;
    }

    try {
      if (!isSubscribed) {
        // 구독 실행
        const res = await postsubData(targetId);

        if (res) {
          isSubscribed = true;
          updateSubscribeUI(true); // UI 한 번만 업데이트
        }
      } else {
        // 구독 취소
        const res = await delsubData();

        if (res) {
          isSubscribed = false;
          updateSubscribeUI(false); // UI 한 번만 업데이트
        }
      }
    } catch (err) {
      console.error(err);
      isSubscribed = !isSubscribed;
      updateSubscribeUI(isSubscribed);
      alert('잠시 후 다시 시도해주세요.');
    }
  };
}
