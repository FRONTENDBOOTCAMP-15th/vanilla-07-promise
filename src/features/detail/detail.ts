import { getAxios } from '../utils/axios';
import {
  renderSubscribeSection,
  initSubscribeButton,
} from '../../common/sub-section';

const axios = getAxios();

//detail 타입 정의
interface PostDetail {
  title: string;
  extra?: { subTitle?: string };
  content: string;
  image?: string;
  imageCaption?: string;
  views?: number;
  user: {
    _id: number;
    name: string;
    image: string;
    job?: string;
    desc?: string;
    bio?: string;
    subscriberCount?: number;
  };
  likeCount?: number;
}

//작가 type 정의
interface Author {
  _id: number;
  name: string;
  image: string;
  bookmarkedBy?: { users: number };
  likedBy?: { users: number };
  extra?: {
    job?: string;
    biography?: string;
    keyword?: string[];
  };
}
//기본 좋아요 상태
let isLiked = false;

//URL에서 id 정보 받아오기
function getPostIdFromUrl(): number | null {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const parsedId = parseInt(id ?? '', 10);
  return !isNaN(parsedId) ? parsedId : null;
}

//상세 페이지 api 받아오기
async function fetchPostDetail(postId: number): Promise<PostDetail> {
  const res = await axios.get(`/posts/${String(postId)}`);
  return res.data.item;
}

//작가 정보 api 받아오기
async function fetchAuthorExtraInfo(userId: number): Promise<Author | null> {
  const res = await axios.get('/users', {
    params: {
      filter: JSON.stringify({ _id: userId }),
    },
  });
  const users: Author[] = res.data?.item ?? [];
  return users.find(user => user._id === userId) ?? null;
}

//좋아요 버튼
function updateLikeUI(active: boolean) {
  const heartBtn = document.getElementById('heartBtn')!;
  const img = heartBtn.querySelector('img')!;
  const countEl = heartBtn.querySelector('.like-count')!;
  let count = parseInt(countEl.textContent ?? '0');

  if (active) {
    img.src = '/assets/images/detail/heart.png';
    count += 1;
  } else {
    img.src = '/assets/images/detail/heart-a.png';
    count = Math.max(0, count - 1);
  }
  countEl.textContent = String(count);
}

function initLike(postId: number) {
  void postId;
  const heart = document.getElementById('heartBtn');
  heart?.addEventListener('click', async () => {
    const isLoggedIn = false;
    if (!isLoggedIn) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }

    if (isLiked) return;
    isLiked = true;
    updateLikeUI(true);
  });
}

function renderPost(item: PostDetail) {
  const titleEl = document.querySelector<HTMLElement>('.title')!;
  const subtitleEl = document.querySelector<HTMLElement>('.subtitle')!;
  const authorEl = document.querySelector<HTMLElement>('.author')!;
  const contentEl = document.querySelector<HTMLElement>('.content')!;
  const imageEl =
    document.querySelector<HTMLImageElement>('.image-section img')!;
  const captionEl = document.querySelector<HTMLElement>('.image-caption');
  const authorNameEl = document.querySelector<HTMLElement>('.author-name')!;
  const authorImgEl = document.querySelector<HTMLImageElement>('.author-img')!;
  const jobEl = document.querySelector<HTMLElement>('.author-job');
  const descEl = document.querySelector<HTMLElement>('.author-desc');

  titleEl.innerHTML = item.title;
  subtitleEl.textContent = item.extra?.subTitle ?? '';
  authorEl.textContent = `by ${item.user.name}`;

  const plainText = item.content.replace(/<[^>]*>/g, ''); //html제외 텍스트만 인식
  const totalLength = plainText.length;

  const imageSection = document.querySelector<HTMLElement>('.image-section');

  //글자 수 80기준으로 나눠 표시
  if (totalLength <= 80) {
    contentEl.innerHTML = item.content;
    contentEl.style.display = 'block';
  } else {
    const firstPart = plainText.slice(0, 80);
    const secondPart = plainText.slice(80);

    contentEl.textContent = firstPart;
    contentEl.style.display = 'block';

    if (imageSection) {
      const newContentEl = document.createElement('div');
      newContentEl.className = 'content content-below-image';
      newContentEl.textContent = secondPart;
      imageSection.insertAdjacentElement('afterend', newContentEl);
    }
  }

  imageEl.src = item?.image || '/assets/images/author3.png'; //추후 공통 이미지로 첨부 예정
  if (captionEl) captionEl.textContent = item.imageCaption ?? '';

  authorNameEl.textContent = item.user.name;
  authorImgEl.setAttribute('src', item.user.image);
  if (jobEl) jobEl.textContent = item.user.job ?? '';
  if (descEl) descEl.innerHTML = item.user.desc ?? item.user.bio ?? '';
}

document.addEventListener('DOMContentLoaded', async () => {
  const postId = getPostIdFromUrl();
  if (!postId) {
    alert('잘못된 접근입니다.');
    return;
  }

  try {
    const post = await fetchPostDetail(postId);
    renderPost(post);

    const authorInfo = await fetchAuthorExtraInfo(post.user._id);
    if (!authorInfo) return console.error('작성자 정보 오류');

    const subCount = authorInfo.bookmarkedBy?.users ?? 0;
    renderSubscribeSection(post.user._id, subCount);
    initSubscribeButton(postId);

    const likeCountEl = document.querySelector<HTMLElement>('.like-count');
    if (likeCountEl)
      likeCountEl.textContent = String(authorInfo.likedBy?.users ?? 0);
    initLike(postId);
  } catch (err) {
    console.error('로딩 실패:', err);
    alert('게시글을 불러오지 못했습니다.');
  }
});
