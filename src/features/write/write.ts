import postApi from '../../types/postApi.ts';
import { api } from '../../types/apiClient.ts';

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

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  
  // 백엔드가 요구할 수 있는 추가 필드
  formData.append('type', 'febc15-vanilla07-ecad');

  try {
    const { data } = await api.post('/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('[write] 파일 업로드 응답:', data);

    // 백엔드 응답 구조가 예: { ok: true, url: "https://..." }
    if (data?.url) {
      return data.url;
    }

    // item 이나 data.url 형태로 담겨 있을 경우 대응
    if (data?.item?.url) return data.item.url;
    if (data?.item && Array.isArray(data.item) && data.item.length > 0) {
      const first = data.item[0];
      if (first.url) return first.url;
      if (first.path) return first.path;
    }
    if (data?.data?.url) return data.data.url;

    throw new Error('이미지 URL을 받지 못했습니다.');
  } catch (err: unknown) {
    console.error('[write] 이미지 업로드 실패:', err);
    
    // 에러 상세 정보 출력
    if (err && typeof err === 'object' && 'response' in err) {
      const axiosError = err as { response?: { data?: unknown; status?: number } };
      if (axiosError.response) {
        console.error('응답 데이터:', axiosError.response.data);
        console.error('응답 상태:', axiosError.response.status);
      }
    }
    
    throw err;
  }
}

interface CreatePostPayload {
  _id: number;
  type: 'febc15-vanilla07-ecad';
  title: string;
  extra: {
    subtitle: string;
    align: string;
  };
  content: string;
  createdAt: string;
  image: string;
}

export async function createPostRequest(
  title: string,
  subtitle: string,
  content: string,
  getAlign: () => string,
  file?: File,
): Promise<CreatePostPayload> {
  let imageUrl = '';
  if (file) {
    // 업로드 API 호출해서 URL 받아오기
    imageUrl = await uploadImage(file);
  }

  return {
    _id: Date.now(),
    type: 'febc15-vanilla07-ecad',
    title,
    extra: {
      subtitle,
      align: getAlign(),
    },
    content,
    createdAt: new Date().toISOString(),
    image: imageUrl, // ← 업로드 API에서 받은 URL 저장
  };
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

    const postPayload = {
      type: 'febc15-vanilla07-ecad',
      title,
      subtitle,
      content,
      image: imageUrl || undefined,
      extra: { 
        subtitle, 
        align: document.querySelector('.align-button')?.getAttribute('data-align') ?? 'left' 
      },
    };

    console.log('[write] 게시글 등록 요청:', postPayload);
    const response = await postApi.createPost(postPayload);
    console.log('[write] 게시글 등록 응답:', response);
    
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