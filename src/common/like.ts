import { getAxios } from '../features/utils/axios.ts';
import { getToken, isUserLoggedIn } from '../features/utils/checklogin.ts';

interface BookmarkItem {
  _id: number; // 북마크 자체 id
  target_id: number;
  post: {
    _id: number; // 실제 게시글 id
  };
}

const axios = getAxios();
let isLiked = false;
let bookmarkId: number | null = null;

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

// 좋아요 추가
async function postlikeData(postId: number) {
  if (!getToken()) throw new Error('로그인이 필요합니다');
  try {
    const { data } = await axios.post(
      '/bookmarks/post',
      { target_id: postId },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      },
    );
    console.log(data);
    bookmarkId = data.item._id;
    return data;
  } catch (err) {
    console.log(err);
  }
}

// 좋아요 삭제
async function dellikeData() {
  if (!getToken()) throw new Error('로그인이 필요합니다');
  if (!bookmarkId) return;

  try {
    const { data } = await axios.delete(`/bookmarks/${bookmarkId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    console.log(data);
    bookmarkId = null;
    return data;
  } catch (err) {
    console.log(err);
  }
}

//  현재 게시글이 좋아요 상태인지 확인

async function loadInitialLikedState(postId: number) {
  if (!getToken()) return;

  try {
    const { data } = await axios.get('/bookmarks/post?type=brunch', {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const list: BookmarkItem[] = Array.isArray(data.item) ? data.item : [];

    const found = list.find(b => b.post?._id === postId);

    if (found) {
      isLiked = true;
      bookmarkId = found._id;
      updateLikeUI(true);
    }
  } catch (err) {
    console.log(err);
  }
}

// 좋아요 버튼 초기화 및 이벤트 등록
export async function initLikeButton(postId: number) {
  await loadInitialLikedState(postId); // 페이지 들어올 때 초기 상태

  const heartBtn = document.getElementById('heartBtn');

  heartBtn?.addEventListener('click', async () => {
    if (!isUserLoggedIn()) {
      alert('로그인이 필요한 기능입니다.');
      location.href = '../login/login.html';
      return;
    }

    try {
      if (!isLiked) {
        // 좋아요 실행
        const res = await postlikeData(postId);

        if (res) {
          isLiked = true;
          updateLikeUI(true); // UI 한 번만 업데이트
        }
      } else {
        // 좋아요 취소
        const res = await dellikeData();

        if (res) {
          isLiked = false;
          updateLikeUI(false); // UI 한 번만 업데이트
        }
      }
    } catch (err) {
      console.error(err);
      isLiked = !isLiked;
      updateLikeUI(isLiked);
      alert('잠시 후 다시 시도해주세요.');
    }
  });
}
