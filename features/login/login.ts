import { loginUser, loginKakaoCallback } from '../../types/apiClient';

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
 * 기본 field 상태 업데이트
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

  const msgElem =
    fieldElement.querySelector<HTMLParagraphElement>('.field-message');
  if (msgElem) msgElem.textContent = message ?? '';
}

/**
 * 폼 상태 메시지
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

function resetFieldStates(): void {
  setFieldState('email', 'neutral');
  setFieldState('password', 'neutral');
}

function toggleLoading(isLoading: boolean): void {
  if (!submitButton) return;
  submitButton.disabled = isLoading;
  submitButton.textContent = isLoading ? '로그인 중...' : '로그인';
}

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

function updateSubmitState(): void {
  if (!submitButton) return;
  const canSubmit = validateEmail() && validatePassword();
  submitButton.disabled = !canSubmit;
  submitButton.classList.toggle('is-active', canSubmit);
}

/**
 * 🔥 일반 로그인 처리
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
 * 🔥 카카오 로그인(authorize) 이동
 */
function initKakaoLogin(): void {
  if (!kakaoLoginButton) return;

  const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
  const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

  kakaoLoginButton.addEventListener('click', () => {
    const url =
      `https://kauth.kakao.com/oauth/authorize?response_type=code` +
      `&client_id=${REST_API_KEY}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&scope=account_email,gender`;

    window.location.href = url;
  });
}

/**
 * 🔥 redirect_uri 에서 code 감지 → 서버로 카카오 회원가입/로그인 요청
 */
async function handleKakaoCallback(): Promise<void> {
  const url = new URL(window.location.href);
  const code = url.searchParams.get('code');

  if (!code) return; // 카카오에서 돌아온 것이 아님

  setFormStatus('카카오 계정 확인 중...', 'info');

  try {
    const response = await loginKakaoCallback(code);

    if (!response.ok) {
      setFormStatus(response.message ?? '카카오 로그인 실패', 'error');
      return;
    }

    setFormStatus('카카오 로그인 성공! 🎉', 'success');
    window.location.href = '/dashboard.html';
  } catch (err) {
    console.error('[kakao callback error]', err);
    setFormStatus('카카오 로그인 처리 중 오류 발생', 'error');
  }
}

/**
 * 초기화
 */

emailInput?.addEventListener('input', () => {
  validateEmail();
  updateSubmitState();
});
emailInput?.addEventListener('blur', () => validateEmail());

passwordInput?.addEventListener('input', () => {
  validatePassword();
  updateSubmitState();
});
passwordInput?.addEventListener('blur', () => validatePassword());

form?.addEventListener('submit', event => void handleSubmit(event));

initKakaoLogin();
handleKakaoCallback(); // 🔥 카카오 callback 자동 처리 추가
updateSubmitState();
