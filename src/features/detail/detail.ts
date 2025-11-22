import { getAxios } from '../utils/axios';
import {
  renderSubscribeSection,
  initSubscribeButton,
} from '../../common/sub-section';
import { saveRecentBook } from '../mybox/recent';
import { initLikeButton } from '../../common/like.ts';

const axios = getAxios();

//상세 페이지 타입
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
  updatedAt?: string;
}

//작가 타입
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

// 게시글 ID 추출
function getPostIdFromUrl(): number | null {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const parsedId = parseInt(id ?? '', 10);
  return !isNaN(parsedId) ? parsedId : null;
}

// 게시글 및 작가 정보 불러오기
async function fetchPostDetail(postId: number): Promise<PostDetail> {
  const res = await axios.get(`/posts/${String(postId)}`);
  return res.data.item;
}

async function fetchAuthorExtraInfo(userId: number): Promise<Author | null> {
  const res = await axios.get('/users', {
    params: {
      filter: JSON.stringify({ _id: userId }),
    },
  });
  const users: Author[] = res.data?.item ?? [];
  return users.find(user => user._id === userId) ?? null;
}

// 게시글 렌더링
function renderPost(item: PostDetail) {
  const titleEl = document.querySelector<HTMLElement>('.title')!;
  const subtitleEl = document.querySelector<HTMLElement>('.subtitle')!;
  const contentEl = document.querySelector<HTMLElement>('.content')!;
  const imageEl =
    document.querySelector<HTMLImageElement>('.image-section img')!;
  const captionEl = document.querySelector<HTMLElement>('.image-caption');
  const authorNameInlineEl = document.querySelector<HTMLElement>(
    '.author-name-inline',
  )!;
  const authorDateEl = document.querySelector<HTMLElement>('.author-date')!;
  const authorNameEl = document.querySelector<HTMLElement>('.author-name')!;
  const authorImgEl = document.querySelector<HTMLImageElement>('.author-img')!;
  const jobEl = document.querySelector<HTMLElement>('.author-job');
  const descEl = document.querySelector<HTMLElement>('.author-desc');

  // 제목, 부제목, 작성자 표시
  titleEl.innerHTML = item.title;
  subtitleEl.textContent = item.extra?.subTitle ?? '';
  authorNameInlineEl.textContent = `by ${item.user.name}`;
  authorDateEl.textContent = item.updatedAt
    ? ` · ${new Date(item.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      })}`
    : '';

  // 본문 80자 사진 기준 분리하기
  const plainText = item.content.replace(/<[^>]*>/g, '');
  const totalLength = plainText.length;
  const imageSection = document.querySelector<HTMLElement>('.image-section');
  const containsHtmlTags = /<\/?[a-z][\s\S]*>/i.test(item.content);

  if (containsHtmlTags) {
    contentEl.textContent =
      '이 콘텐츠는 HTML형식이라 내용 보기는 불가능 합니다';
  } else {
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
  }

  // 이미지 및 대체 이미지
  imageEl.src = item?.image || '/assets/images/mybox-icons/no-img.svg';
  if (captionEl) captionEl.textContent = item.imageCaption ?? '';

  // 작성자 정보
  authorNameEl.textContent = item.user.name;
  authorImgEl.setAttribute(
    'src',
    item.image ?? '/assets/images/search/defaultProfil.webp',
  );
  if (jobEl) jobEl.textContent = item.user.job ?? '';
  if (descEl) descEl.innerHTML = item.user.desc ?? item.user.bio ?? '';
}

//  초기 실행
document.addEventListener('DOMContentLoaded', async () => {
  const postId = getPostIdFromUrl();
  if (!postId) {
    alert('잘못된 접근입니다.');
    return;
  }

  try {
    const post = await fetchPostDetail(postId);
    renderPost(post);

    loadDetail();

    const authorInfo = await fetchAuthorExtraInfo(post.user._id);
    if (!authorInfo) return console.error('작성자 정보 오류');

    // 구독
    const subCount = authorInfo.bookmarkedBy?.users ?? 0;
    const isUserSubscribed = false;
    renderSubscribeSection(subCount, isUserSubscribed);
  initSubscribeButton();

    // 직업 및 소개글
    const jobEl = document.querySelector<HTMLElement>('.author-job');
    const descEl = document.querySelector<HTMLElement>('.author-desc');
    if (jobEl) jobEl.textContent = authorInfo.extra?.job ?? '';
    if (descEl)
      descEl.innerHTML =
        authorInfo.extra?.biography?.replace(/\n/g, '<br>') ?? '';

    // 좋아요 수
    const likeCountEl = document.querySelector<HTMLElement>('.like-count');
    if (likeCountEl)
      likeCountEl.textContent = String(authorInfo.likedBy?.users ?? 0);

    initLikeButton();

    // 작가홈 링크
    const writerId = authorInfo._id;
    const linkEls = document.querySelectorAll('.author-link');
    linkEls.forEach(link => {
      link.setAttribute(
        'href',
        `/src/features/writerhome/writerhome.html?_id=${writerId}`,
      );
    });
  } catch (err) {
    console.error('로딩 실패:', err);
    alert('게시글을 불러오지 못했습니다.');
  }
});

// ======= 작가 홈 부분 ========
function getBookIdFromURL() {
  const params = new URLSearchParams(location.search);
  return Number(params.get('id'));
}

function extractAuthor(raw: string): string {
  if (!raw) return '';
  return raw.replace('by', '').split('·')[0].trim();
}

function loadDetail() {
  const _id = getBookIdFromURL();
  const title = document.querySelector('.title')?.textContent?.trim() ?? '';
  const imgEl = document.querySelector(
    '.image-section img',
  ) as HTMLImageElement;

  const image = imgEl?.src || '/assets/images/mybox-icons/no-img.svg';

  const rawAuthor =
    document.querySelector('.author-name-inline')?.textContent ?? '';
  const name = extractAuthor(rawAuthor);

  saveRecentBook({
    _id,
    title,
    image,
    name,
  });
}
