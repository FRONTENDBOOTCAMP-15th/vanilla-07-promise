import { loginUser, loginKakao } from '../../types/apiClient';

const form = document.querySelector<HTMLFormElement>('#login-form');
const emailInput = document.querySelector<HTMLInputElement>('#email-input');
const passwordInput =
  document.querySelector<HTMLInputElement>('#password-input');
const submitButton = document.querySelector<HTMLButtonElement>('.login-submit');
const kakaoLoginButton = document.querySelector<HTMLButtonElement>(
  "[data-role='kakao-login']",
);
const formStatus = document.querySelector<HTMLDivElement>('.form-status');

const fieldElements = {
  email: document.querySelector<HTMLDivElement>("[data-field='email']"),
  password: document.querySelector<HTMLDivElement>("[data-field='password']"),
} as const;

type FieldKey = keyof typeof fieldElements;
type FieldState = 'neutral' | 'success' | 'error' | 'info';

/**
 * ✅ 필드 상태 업데이트
 */
function setFieldState(
  field: FieldKey,
  state: FieldState,
  message?: string,
): void {
  const fieldElement = fieldElements[field];
  if (!fieldElement) return;

  fieldElement.classList.remove('field-success', 'field-error', 'field-info');

  if (state !== 'neutral') {
    const className =
      state === 'success'
        ? 'field-success'
        : state === 'error'
          ? 'field-error'
          : 'field-info';
    fieldElement.classList.add(className);
  }

  // ✅ field-message로 수정 (HTML과 일치)
  const msgElem =
    fieldElement.querySelector<HTMLParagraphElement>('.field-message');
  if (msgElem) msgElem.textContent = message ?? '';
}

/**
 * ✅ 폼 상태 메시지
 */
function setFormStatus(
  message: string,
  type: 'success' | 'error' | 'info' = 'info',
): void {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.classList.remove('is-success', 'is-error', 'is-info');
  formStatus.classList.add(`is-${type}`);
}

/**
 * ✅ 필드 초기화
 */
function resetFieldStates(): void {
  setFieldState('email', 'neutral');
  setFieldState('password', 'neutral');
}

/**
 * ✅ 버튼 로딩 상태 토글
 */
function toggleLoading(isLoading: boolean): void {
  if (!submitButton) return;
  submitButton.disabled = isLoading;
  submitButton.textContent = isLoading ? '로그인 중...' : '로그인';
}

/**
 * ✅ 이메일 유효성 검사
 */
function validateEmail(): boolean {
  if (!emailInput) return false;
  const value = emailInput.value.trim();
  if (!value) {
    setFieldState('email', 'error', '이메일을 입력해주세요.');
    return false;
  }
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  if (!isValid) {
    setFieldState('email', 'error', '올바른 이메일 형식이 아니에요.');
    return false;
  }
  setFieldState('email', 'success', '좋아요!');
  return true;
}

/**
 * ✅ 비밀번호 유효성 검사
 */
function validatePassword(): boolean {
  if (!passwordInput) return false;
  const value = passwordInput.value.trim();
  if (value.length < 6) {
    setFieldState('password', 'error', '비밀번호는 6자 이상이어야 해요.');
    return false;
  }
  setFieldState('password', 'success', '안전한 비밀번호네요.');
  return true;
}

/**
 * ✅ 로그인 버튼 활성화 갱신
 */
function updateSubmitState(): void {
  if (!submitButton) return;
  const canSubmit = validateEmail() && validatePassword();
  submitButton.disabled = !canSubmit;
  submitButton.classList.toggle('is-active', canSubmit);
}

/**
 * ✅ 로그인 처리
 */
async function handleSubmit(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  if (!form || !emailInput || !passwordInput) return;

  if (!validateEmail() || !validatePassword()) return;

  toggleLoading(true);
  setFormStatus('로그인 중입니다...', 'info');

  try {
    const response = await loginUser({
      email: emailInput.value.trim(),
      password: passwordInput.value.trim(),
    });

    if (!response.ok) {
      setFormStatus(response.message ?? '로그인 실패', 'error');
      setFieldState('password', 'error', '비밀번호를 다시 확인해주세요.');
      return;
    }

    setFormStatus('로그인 성공! 🎉', 'success');
    form.reset();
    resetFieldStates();

    // 로그인 후 이동
    window.location.href = '/dashboard.html';
  } catch (error) {
    console.error('[handleSubmit] 로그인 요청 실패:', error);
    setFormStatus('서버와 통신할 수 없습니다.', 'error');
  } finally {
    toggleLoading(false);
    updateSubmitState();
  }
}

/**
 * ✅ 카카오 로그인 초기화
 */
function initKakaoLogin(): void {
  if (!kakaoLoginButton) return;
  kakaoLoginButton.addEventListener('click', async () => {
    try {
      setFormStatus('카카오 로그인 페이지로 이동합니다...', 'info');
      await loginKakao();
    } catch (error) {
      console.error('[loginKakao] 실패:', error);
      setFormStatus('카카오 로그인 중 오류가 발생했습니다.', 'error');
    }
  });
}

/**
 * ✅ 초기화
 */

// ✅ 입력할 때마다 유효성 검사 실행
emailInput?.addEventListener('input', () => {
  validateEmail();
  updateSubmitState();
});

emailInput?.addEventListener('blur', () => {
  validateEmail();
});

passwordInput?.addEventListener('input', () => {
  validatePassword();
  updateSubmitState();
});

passwordInput?.addEventListener('blur', () => {
  validatePassword();
});

form?.addEventListener('submit', event => {
  void handleSubmit(event);
});

initKakaoLogin();
updateSubmitState();
