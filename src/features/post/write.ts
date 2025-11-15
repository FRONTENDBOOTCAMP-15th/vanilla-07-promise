import postApi, { type PostPayload } from '../../../types/postApi';

const form = document.querySelector<HTMLFormElement>('.post-form');
const titleInput = document.querySelector<HTMLInputElement>('#title');
const subtitleInput = document.querySelector<HTMLInputElement>('#subtitle');
const contentInput = document.querySelector<HTMLTextAreaElement>('#content');
const imageInput = document.querySelector<HTMLInputElement>(
  'input[name="imageUpload"]',
);
const submitButton = document.querySelector<HTMLButtonElement>('.submit-btn');
const backButton = document.querySelector<HTMLButtonElement>('header > button');
const alignButton = document.querySelector<HTMLElement>(
  '.align-button, [aria-label="목록 정렬"]',
);
const keyboardIcon =
  document.querySelector<HTMLImageElement>('.right-buttons img');

const STORAGE_KEY = 'vanilla:posts';

interface StoredPost {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  images: Array<{
    name: string;
    type: string;
    size: number;
  }>;
  createdAt: string;
}
keyboardIcon?.addEventListener('click', () => {
  contentInput?.focus();
});

setTimeout(() => {
  contentInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}, 50);

const generateId = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
};

const loadPosts = (): StoredPost[] => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredPost[]) : [];
  } catch (error) {
    console.warn('[write] failed to load saved posts', error);
    return [];
  }
};

const savePosts = (posts: StoredPost[]): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (error) {
    console.error('[write] failed to persist posts', error);
  }
};

const persistLocally = (payload: PostPayload): void => {
  const posts = loadPosts();
  const newPost: StoredPost = {
    id: generateId(),
    title: payload.title,
    subtitle: payload.subtitle ?? '',
    content: payload.content,
    images:
      imageInput?.files && imageInput.files.length > 0
        ? Array.from(imageInput.files).map(file => ({
            name: file.name,
            type: file.type,
            size: file.size,
          }))
        : [],
    createdAt: new Date().toISOString(),
  };

  savePosts([newPost, ...posts]);
};

const handleSubmit = async (event: SubmitEvent): Promise<void> => {
  event.preventDefault();
  if (!form || !titleInput || !contentInput) {
    return;
  }

  const title = titleInput.value.trim();
  const subtitle = subtitleInput?.value.trim() ?? '';
  const content = contentInput.value.trim();

  if (!title) {
    alert('제목을 입력해주세요.');
    titleInput.focus();
    return;
  }

  if (!content) {
    alert('내용을 입력해주세요.');
    contentInput.focus();
    return;
  }

  const payload: PostPayload = {
    title,
    content,
    ...(subtitle && { subtitle }),
  };

  try {
    const response = await postApi.createPost(payload);
    if (!response.ok) {
      throw new Error(response.message ?? '게시글 등록에 실패했습니다.');
    }
    alert('글이 등록되었습니다.');
  } catch (error) {
    console.error('[write] post submission failed, fallback to local', error);
    persistLocally(payload);
    alert('네트워크 오류로 로컬에 임시 저장했습니다.');
  } finally {
    form.reset();
  }
};

const updateSubmitButtonState = (): void => {
  if (!submitButton) {
    return;
  }
  const title = titleInput?.value.trim() ?? '';
  const content = contentInput?.value.trim() ?? '';

  if (title && content) {
    submitButton.classList.add('active');
  } else {
    submitButton.classList.remove('active');
  }
};

const registerFieldListeners = (): void => {
  titleInput?.addEventListener('input', updateSubmitButtonState);
  subtitleInput?.addEventListener('input', updateSubmitButtonState);
  contentInput?.addEventListener('input', updateSubmitButtonState);
};

const init = (): void => {
  backButton?.addEventListener('click', event => {
    event.preventDefault();
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.assign('/');
    }
  });

  if (submitButton && form) {
    submitButton.addEventListener('click', () => {
      form.requestSubmit();
    });
  }

  form?.addEventListener('submit', event => {
    void handleSubmit(event);
  });

  if (alignButton && contentInput) {
    const alignments: Array<'left' | 'center' | 'right'> = [
      'left',
      'center',
      'right',
    ];
    let alignIndex = 0;
    alignButton.addEventListener('click', () => {
      alignIndex = (alignIndex + 1) % alignments.length;
      contentInput.style.textAlign = alignments[alignIndex];
      alignButton.setAttribute('data-align', alignments[alignIndex]);
    });
  }

  registerFieldListeners();
  updateSubmitButtonState();
};
init();
