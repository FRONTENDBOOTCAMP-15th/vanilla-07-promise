import postApi from '../../types/postApi';
import { uploadImage } from '../../types/upload';

const form = document.querySelector<HTMLFormElement>('.post-form');
const titleInput = document.querySelector<HTMLInputElement>('#title');
const subtitleInput = document.querySelector<HTMLInputElement>('#subtitle');
const contentInput = document.querySelector<HTMLTextAreaElement>('#content');
const imageInput = document.querySelector<HTMLInputElement>(
  'input[name="imageUpload"]',
);
const submitButton = document.querySelector<HTMLButtonElement>('.submit-btn');
const keyboardIcon =
  document.querySelector<HTMLImageElement>('.right-buttons img');
const alignButton = document.querySelector<HTMLElement>('.align-button');

const STORAGE_KEY = 'vanilla:posts';

interface StoredPost {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  images: Array<{ name: string; type: string; size: number }>;
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
  return `${Date.now()}-${Math.random().toString(10).slice(2, 10)}`;
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

const validateRequiredFields = (): boolean => {
  const title = titleInput?.value.trim() ?? '';
  const subtitle = subtitleInput?.value.trim() ?? '';
  const content = contentInput?.value.trim() ?? '';

  if (!title) {
    alert('제목을 입력해주세요.');
    titleInput?.focus();
    return false;
  }
  if (!subtitle) {
    alert('소제목을 입력해주세요.');
    subtitleInput?.focus();
    return false;
  }
  if (!content) {
    alert('내용을 입력해주세요.');
    contentInput?.focus();
    return false;
  }
  return true;
};

const persistLocally = (
  title: string,
  subtitle: string,
  content: string,
): void => {
  const posts = loadPosts();
  const newPost: StoredPost = {
    id: generateId(),
    title,
    subtitle,
    content,
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
  if (!form || !titleInput || !contentInput) return;

  if (!validateRequiredFields()) return;

  const title = titleInput.value.trim();
  const subtitle = subtitleInput?.value.trim() ?? '';
  const content = contentInput.value.trim();
  const file = imageInput?.files?.[0];

  try {
    let imageUrl = '';

    // 이미지가 있을 때만 업로드 시도
    if (file) {
      try {
        imageUrl = await uploadImage(file);
        console.log('[write] 이미지 업로드 성공:', imageUrl);
      } catch (imgError) {
        console.warn('[write] 이미지 업로드 실패, 이미지 없이 진행:', imgError);
        // 이미지 없이 계속 진행
      }
    }

    const postPayload: {
      type: string;
      title: string;
      subtitle: string;
      content: string;
      image?: string;
      images?: string;
      extra: {
        subtitle: string;
        align: string;
      };
    } = {
      type: 'febc15-vanilla07-ecad',
      title,
      subtitle,
      content,
      extra: {
        subtitle,
        align:
          document.querySelector('.align-button')?.getAttribute('data-align') ??
          'left',
      },
    };

    // 이미지 URL이 있을 때만 image와 images 필드 추가
    // 백엔드는 'image' 필드를 기대하지만, 호환성을 위해 'images'도 함께 전송
    if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== '') {
      const trimmedUrl = imageUrl.trim();
      // image 필드를 우선적으로 설정 (백엔드가 기대하는 필드)
      postPayload.image = trimmedUrl;
      // images 필드도 함께 전송 (호환성)
      postPayload.images = trimmedUrl;
      console.log('[write] ✅ 이미지 URL 포함:', trimmedUrl);
      console.log(
        '[write] ✅ 이미지 필드 확인 - image:',
        postPayload.image,
        'images:',
        postPayload.images,
      );
    } else {
      console.warn('[write] ⚠️ 이미지 URL 없음 - 이미지 없이 게시글 등록');
      console.warn('[write] ⚠️ imageUrl 값:', imageUrl);
      // 이미지가 없어도 게시글은 등록 가능
    }

    console.log(
      '[write] 게시글 등록 요청:',
      JSON.stringify(postPayload, null, 2),
    );
    const response = await postApi.createPost(postPayload);
    console.log('[write] 게시글 등록 응답:', JSON.stringify(response, null, 2));

    if (!response.ok) {
      throw new Error(response.message ?? '게시글 등록에 실패했습니다.');
    }

    alert('글이 등록되었습니다.');
    form?.reset();
  } catch (error) {
    console.error('[write] post submission failed:', error);

    // 네트워크 오류 시 로컬 저장 시도
    try {
      persistLocally(title, subtitle, content);
      alert('네트워크 오류로 로컬에 임시 저장했습니다.');
      form?.reset();
    } catch (localError) {
      console.error('[write] 로컬 저장도 실패:', localError);
      alert('글 등록에 실패했습니다. 다시 시도해주세요.');
    }
  }
};

const updateSubmitButtonState = (): void => {
  if (!submitButton) return;
  const title = titleInput?.value.trim() ?? '';
  const subtitle = subtitleInput?.value.trim() ?? '';
  const content = contentInput?.value.trim() ?? '';
  const hasAny = Boolean(title || subtitle || content);
  if (hasAny) {
    submitButton.classList.add('active');
    submitButton.removeAttribute('disabled');
  } else {
    submitButton.classList.remove('active');
    submitButton.setAttribute('disabled', 'true');
  }
};

const registerFieldListeners = (): void => {
  titleInput?.addEventListener('input', updateSubmitButtonState);
  subtitleInput?.addEventListener('input', updateSubmitButtonState);
  contentInput?.addEventListener('input', updateSubmitButtonState);
};

const initAlignControl = (): void => {
  if (!alignButton || !contentInput) return;

  const alignments: Array<'left' | 'center' | 'right'> = [
    'left',
    'center',
    'right',
  ];

  const applyAlign = (align: 'left' | 'center' | 'right'): void => {
    alignButton.setAttribute('data-align', align);
    contentInput.style.textAlign = align;
  };

  const current =
    (alignButton.getAttribute('data-align') as
      | 'left'
      | 'center'
      | 'right'
      | null) || 'left';
  applyAlign(current);

  alignButton.addEventListener('click', e => {
    e.preventDefault();
    const now =
      (alignButton.getAttribute('data-align') as
        | 'left'
        | 'center'
        | 'right'
        | null) || 'left';
    const idx = alignments.indexOf(now);
    const next = alignments[(idx + 1) % alignments.length];
    applyAlign(next);
  });
};

const init = (): void => {
  const backButton =
    document.querySelector<HTMLButtonElement>('header > button');
  backButton?.addEventListener('click', e => {
    e.preventDefault();
    if (window.history.length > 0) {
      window.history.back();
    }
  });

  form?.addEventListener('submit', e => {
    void handleSubmit(e);
  });

  registerFieldListeners();
  updateSubmitButtonState();
  initAlignControl();
};
init();
