import postApi, { type PostPayload } from '../../types/postApi';
import { createPostRequest } from '../../types/upload';

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

keyboardIcon?.addEventListener('click', () => {
  contentInput?.focus();
});

setTimeout(() => {
  contentInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}, 50);

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

const handleSubmit = async (event: SubmitEvent): Promise<void> => {
  event.preventDefault();

  if (!form || !titleInput || !contentInput) {
    return;
  }

  if (!validateRequiredFields()) return;

  const title = titleInput.value.trim() ?? '';
  const subtitle = subtitleInput?.value.trim() ?? '';
  const content = contentInput.value.trim() ?? '';
  const file =
    imageInput?.files && imageInput.files.length > 0
      ? imageInput.files[0]
      : undefined;

  const payload = await createPostRequest(
    title,
    subtitle,
    content,
    () =>
      document.querySelector('.align-button')?.getAttribute('data-align') ?? '',
    file,
  );

  // CreatePostPayload를 PostPayload로 변환
  const postPayload: PostPayload = {
    type: 'brunch',
    title: payload.title,
    content: payload.content,
    extra: {
      subTitle: Array.isArray(payload.extra.subtitle)
        ? payload.extra.subtitle.join(', ')
        : payload.extra.subtitle,
    },
    image: payload.image || undefined,
  };
  try {
    const response = await postApi.createPost(postPayload);
    if (!response.ok) {
      throw new Error(response.message ?? '게시글 등록에 실패했습니다.');
    }

    alert('글이 등록되었습니다.');

    // 생성된 게시글의 ID를 사용하여 detail 페이지로 이동
    const postId = response.item?._id;
    if (postId) {
      form?.reset();
      window.location.href = `/src/features/detail/detail.html?id=${postId}`;
    } else {
      // ID를 받지 못한 경우 홈으로 이동
      form?.reset();
      window.location.href = '/';
    }
  } catch (error) {
    console.error('[write] post submission failed:', error);
    const errorMessage =
      error instanceof Error ? error.message : '게시글 등록에 실패했습니다.';
    alert(errorMessage);
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
  const backButton = document.querySelector<HTMLButtonElement>('.cancel-btn');

  backButton?.addEventListener('click', e => {
    e.preventDefault();
    if (window.history.length > 0) {
      window.history.back();
    } else {
      window.location.href = "/";
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
