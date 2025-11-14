import {
  findLocalRegisteredUser,
  loginUser,
} from '../../../types/apiClient';



const form = document.querySelector<HTMLFormElement>('#login-form');
const emailInput = document.querySelector<HTMLInputElement>('#email-input');
const passwordInput =
  document.querySelector<HTMLInputElement>('#password-input');
const submitButton = document.querySelector<HTMLButtonElement>('.login-submit');

const rememberButton = document.querySelector<HTMLButtonElement>(
  "[data-role='remember']",
);
const formStatus = document.querySelector<HTMLDivElement>('.form-status');

const fieldElements = {
  email: document.querySelector<HTMLDivElement>("[data-field='email']"),
  password: document.querySelector<HTMLDivElement>("[data-field='password']"),
} as const;

type FieldKey = keyof typeof fieldElements;
type FieldState = 'neutral' | 'success' | 'error' | 'info';

/* ================================
   🔧 필드 상태 변경
================================ */
function setFieldState(
  field: FieldKey,
  state: FieldState,
  message?: string,
): void {
  const fieldElement = fieldElements[field];
  if (!fieldElement) return;

  fieldElement.classList.remove('field-success', 'field-error', 'field-info');

  if (state !== 'neutral') {
    fieldElement.classList.add(
      state === 'success'
        ? 'field-success'
        : state === 'error'
          ? 'field-error'
          : 'field-info',
    );
  }

  const msgElem =
    fieldElement.querySelector<HTMLParagraphElement>('.field-message');
  if (msgElem) msgElem.textContent = message ?? '';
}

/* ================================
   🔧 폼 상태 메시지
================================ */
function setFormStatus(
  message: string,
  type: 'success' | 'error' | 'info' = 'info',
): void {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.classList.remove('is-success', 'is-error', 'is-info');
  formStatus.classList.add(`is-${type}`);
}

/* ================================
   🔧 버튼 로딩
================================ */
function toggleLoading(isLoading: boolean): void {
  if (!submitButton) return;
  submitButton.disabled = isLoading;
  submitButton.textContent = isLoading ? '로그인 중...' : '로그인';
}

/* ================================
   🔍 이메일/비번 검증
================================ */
function validateEmail(): boolean {
  if (!emailInput) return false;

  const value = emailInput.value.trim();
  if (!value) {
    setFieldState('email', 'error', '이메일을 입력해주세요.');
    return false;
  }

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  if (!isEmail) {
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

const REMEMBER_KEY = 'vanilla:login:remember';

interface RememberPayload {
  email: string;
  remember: boolean;
}

function loadRememberedLogin(): void {
  if (!emailInput) return;

  try {
    const raw = window.localStorage.getItem(REMEMBER_KEY);
    if (!raw) return;

    const payload = JSON.parse(raw) as RememberPayload;
    if (payload.remember && payload.email) {
      emailInput.value = payload.email;
      rememberButton?.classList.add('is-active');
      rememberButton?.setAttribute('aria-pressed', 'true');
      setFieldState('email', 'success', '이메일을 불러왔어요.');
    }
  } catch (error) {
    console.warn('[login] failed to load remembered login:', error);
  }
}

function saveRememberedLogin(email: string, remember: boolean): void {
  try {
    if (remember) {
      const payload: RememberPayload = { email, remember: true };
      window.localStorage.setItem(REMEMBER_KEY, JSON.stringify(payload));
    } else {
      window.localStorage.removeItem(REMEMBER_KEY);
    }
  } catch (error) {
    console.warn('[login] failed to persist remember data:', error);
  }
}

/* ================================
   🔥 일반 로그인 (200 방식)
================================ */
async function handleSubmit(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  if (!form || !emailInput || !passwordInput) return;

  if (!validateEmail() || !validatePassword()) return;

  toggleLoading(true);
  setFormStatus('로그인 중입니다...', 'info');

  const emailValue = emailInput.value.trim();
  const passwordValue = passwordInput.value.trim();
  const shouldRemember =
    rememberButton?.classList.contains('is-active') ?? false;

  const completeLogin = (): void => {
    setFormStatus('로그인 성공! 🎉', 'success');
    saveRememberedLogin(emailValue, shouldRemember);
    form.reset();
    setFieldState('email', 'neutral');
    setFieldState('password', 'neutral');
    window.location.href = '/index.html';
  };

  try {
    const response = await loginUser({
      email: emailValue,
      password: passwordValue,
    });

    // 🔥 HTTP 200 + ok:false → 로그인 실패 처리
    if (!response.ok) {
      const message =
        response.message ?? '아이디와 패스워드를 확인하시기 바랍니다.';
      const localUser = findLocalRegisteredUser(emailValue);

      if (localUser && localUser.password === passwordValue) {
        completeLogin();
        return;
      }

      setFormStatus(message, 'error');
      if (message.includes('아이디') || message.includes('이메일')) {
        setFieldState('email', 'error', message);
      }
      if (message.includes('비밀번호')) {
        setFieldState('password', 'error', message);
      } else {
        setFieldState('password', 'error', message);
      }
      return;
    }

    // 🔥 성공
    completeLogin();
  } catch (error) {
    console.error('[handleSubmit] 로그인 요청 실패:', error);
    const axiosError = error as {
      response?: { data?: { message?: string } };
    };

    const serverMessage =
      axiosError?.response?.data?.message ??
      '아이디와 패스워드를 확인하시기 바랍니다.';

    const localUser = findLocalRegisteredUser(emailValue);
    if (localUser && localUser.password === passwordValue) {
      completeLogin();
      return;
    }

    setFormStatus(serverMessage, 'error');
    if (serverMessage.includes('아이디') || serverMessage.includes('이메일')) {
      setFieldState('email', 'error', serverMessage);
    }
    if (serverMessage.includes('비밀번호')) {
      setFieldState('password', 'error', serverMessage);
    }
  } finally {
    toggleLoading(false);
    updateSubmitState();
  }
}

/* ================================
   초기화
================================ */
emailInput?.addEventListener('input', () => {
  validateEmail();
  updateSubmitState();
});
emailInput?.addEventListener('blur', validateEmail);

passwordInput?.addEventListener('input', () => {
  validatePassword();
  updateSubmitState();
});
passwordInput?.addEventListener('blur', validatePassword);

form?.addEventListener('submit', event => void handleSubmit(event));

rememberButton?.addEventListener('click', () => {
  if (!rememberButton) return;

  const isActive = rememberButton.classList.toggle('is-active');
  rememberButton.setAttribute('aria-pressed', String(isActive));

  if (!isActive) {
    saveRememberedLogin('', false);
  } else if (emailInput?.value.trim()) {
    saveRememberedLogin(emailInput.value.trim(), true);
  }
});

loadRememberedLogin();
updateSubmitState();
