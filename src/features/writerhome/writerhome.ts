import { TEMP_TOKEN } from '../../common/token';
import type {
  SubsInfo,
  WriteList,
  WriterInfo,
} from '../../types/writerhome-type/writerhome-type';
import { getAxios } from '../utils/axios';
import {
  renderSubscribeSection,
  initSubscribeButton,
} from '../../common/sub-section';

// 작가 정보
function getWriterId(): number {
  const params = new URLSearchParams(location.search);
  return Number(params.get('_id'));
}

async function getWriterInfoData() {
  const axios = getAxios();
  const writerId = getWriterId();

  if (!writerId) {
    console.error('URL에서 id를 찾을 수 없습니다.');
    return;
  }

  try {
    const { data } = await axios.get(`/users/${writerId}`, {
      headers: {
        Authorization: `Bearer ${TEMP_TOKEN}`,
      },
    });
    return data;
  } catch (err) {
    console.log(err);
  }
}

function renderWriterInfo(Info: WriterInfo) {
  const list = document.querySelector('.writer-card__profile');
  const noImg =
    Info.image && Info.image.startsWith('http')
      ? Info.image
      : '/assets/images/search/defaultProfil.webp';

  if (list) {
    list.innerHTML = `
    <div class="writer-card__info">
    <p class="writer-card__name">${Info.name}</p>
    <p class="writer-card__job">${Info.extra?.job ?? ''}</p>
    </div>
    <img src=${noImg} alt="작가프로필" />
    `;
  }
}

const writerInfoData = await getWriterInfoData();

if (writerInfoData?.ok) {
  renderWriterInfo(writerInfoData.item);
}

// 구독

// 구독자 수 UI 렌더링
renderSubscribeSection(
  writerInfoData.item._id,
  writerInfoData.item.bookmarkedBy.users,
);

// 구독 버튼 기능 활성화
initSubscribeButton(writerInfoData.item._id);

// 구독 인포
function getSubsInfoId(): number {
  const params = new URLSearchParams(location.search);
  return Number(params.get('_id'));
}

async function getSubsInfoData() {
  const axios = getAxios();
  const SubsInfoId = getSubsInfoId();
  try {
    const { data } = await axios.get(`/users/${SubsInfoId}`, {
      headers: {
        Authorization: `Bearer ${TEMP_TOKEN}`,
      },
    });
    return data;
  } catch (err) {
    console.log(err);
  }
}

function renderSubsInfo(info: SubsInfo) {
  const list = document.querySelector('.writer-subscribe__info');

  if (list) {
    list.innerHTML = `
      <div>
        <p class="writer-subscribe__subscriber">구독자</p>
        <p class="writer-subscribe__subcount">${info.bookmarkedBy.users}</p>
      </div>
      <div>
        <p class="writer-subscribe__favwriter">관심작가</p>
        <p class="writer-subscribe__favcount">${info.bookmark.users}</p>
      </div>
    `;
  }
}

const subsInfoData = await getSubsInfoData();

if (subsInfoData?.ok) {
  renderSubsInfo(subsInfoData.item);
}

// // 구독 버튼
// const axios = getAxios();

// function getSubsBtnId(): number {
//   const params = new URLSearchParams(location.search);
//   return Number(params.get('_id'));
// }

// const isSubscribed = false;
// const bookmarkId: number | null = null;

// const subscribeBtn = document.querySelector(
//   '.writer-subscribe__button',
// ) as HTMLButtonElement;
// const subsBtnId = getSubsBtnId();

// async function SubscribeStatus() {
//   try {
//     const { data } = await axios.get(`/bookmarks/${subsBtnId}`, {
//       headers: { Authorization: `Bearer ${TEMP_TOKEN}` },
//     });

//     if (data.ok && data.item) {
//       isSubscribed = true;
//       bookmarkId = data.item._id;

//       updateButtonUI(); // 버튼 모양 초기화
//     }
//   } catch (err) {
//     // 구독 안 되어있으면 404가 올 수 있음 → 정상
//     isSubscribed = false;
//     bookmarkId = null;
//     updateButtonUI();
//   }
// }

// async function subscribe() {
//   try {
//     const { data } = await axios.post(
//       `/bookmarks/writer`,
//       { target_id: subsBtnId },
//       {
//         headers: { Authorization: `Bearer ${TEMP_TOKEN}` },
//       },
//     );

//     if (data.ok) {
//       isSubscribed = true;
//       bookmarkId = data.item._id; // 삭제에 필요!
//       updateButtonUI();
//     }
//   } catch (err) {
//     console.log(err);
//   }
// }

// async function unsubscribe() {
//   if (!bookmarkId) return;

//   try {
//     const { data } = await axios.delete(`/bookmarks/${bookmarkId}`, {
//       headers: { Authorization: `Bearer ${TEMP_TOKEN}` },
//     });

//     if (data.ok) {
//       isSubscribed = false;
//       bookmarkId = null;
//       updateButtonUI();
//     }
//   } catch (err) {
//     console.log(err);
//   }
// }

// function updateButtonUI() {
//   if (isSubscribed) {
//     subscribeBtn.textContent = '✔ 구독중';
//     subscribeBtn.classList.add('on'); // 스타일 커스텀 가능
//   } else {
//     subscribeBtn.textContent = '+ 구독하기';
//     subscribeBtn.classList.remove('on');
//   }
// }

// subscribeBtn.addEventListener('click', () => {
//   if (isSubscribed) unsubscribe();
//   else subscribe();
// });

// SubscribeStatus();

// 작가 글 리스트
function getListId(): number {
  const params = new URLSearchParams(location.search);
  return Number(params.get('_id'));
}

async function getWriteListData() {
  const axios = getAxios();
  const ListId = getListId();
  try {
    const { data } = await axios.get(`/posts/users/${ListId}`, {
      headers: {
        Authorization: `Bearer ${TEMP_TOKEN}`,
      },
    });
    return data;
  } catch (err) {
    console.log(err);
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr.replace(/\./g, '-'));

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  };

  const formatted = new Intl.DateTimeFormat('en-US', options).format(date);
  return formatted.replace(',', '.');
}

function renderWriteLists(lists: WriteList[]) {
  const result = lists.map(list => {
    return `
    <li class="write-list__item">
      <a href="/src/features/detail/detail.html?id=${list._id}">${withoutTags(list.title)}</a>
        <p>${withoutTags(list.content)}</p>
          <div class="write-list__data">
            <p>댓글${list.repliesCount}</p>
            <img src="/assets/images/writerhome/round.svg"></img>
            <p>${formatDate(list.createdAt)}</p>
          </div>
    </li>
    `;
  });
  console.log(result);
  const list = document.querySelector('.write-list__items');
  if (list) {
    list.innerHTML = result.join('');
  }
}

//제목 및 본문 태그 들어올 경우 제거
function withoutTags(text: string): string {
  const withoutTags = text.replace(/<\/?[^>]+(>|$)/g, '');
  return withoutTags;
}

function renderEmtyWriteList() {
  const list = document.querySelector('.write-list__items');
  if (list) {
    list.innerHTML = `<li class='write-list__item'><p>작성된 글이 없습니다.</p></li>`;
  }
}

const writeListData = await getWriteListData();

if (
  !writeListData?.ok ||
  !Array.isArray(writeListData.item) ||
  writeListData.item.length === 0
) {
  renderEmtyWriteList();
} else {
  renderWriteLists(writeListData.item);
}
