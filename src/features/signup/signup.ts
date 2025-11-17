import {
  addLocalRegisteredUser,
  isEmailRegisteredLocally,
  isNicknameRegisteredLocally,
  registerUser,
  type User,
  isNameRegisteredInDb,
  isEmailRegisteredInDb,
} from '../../../types/apiClient.ts';
import { saveToken } from '../../common/token.ts';

const metaEnv =
  (import.meta as unknown as { env?: Record<string, string | undefined> })
    .env ?? {};
const KAKAO_REST_API_KEY = metaEnv.VITE_KAKAO_REST_API_KEY ?? '';
const KAKAO_REDIRECT_URI = metaEnv.VITE_KAKAO_REDIRECT_URI ?? '';

const form = document.querySelector<HTMLFormElement>('#signup-form');

const nicknameInput =
  document.querySelector<HTMLInputElement>('#nickname-input');
const emailInput =
  document.querySelector<HTMLInputElement>('input#email-input');
const passwordInput =
  document.querySelector<HTMLInputElement>('#password-input');
const passwordConfirmInput = document.querySelector<HTMLInputElement>(
  '#password-confirm-input',
);
const memberTypeInput =
  document.querySelector<HTMLSelectElement>('#type-input');
const imageInput = document.querySelector<HTMLInputElement>('#image-input');
const providerAccountIdInput =
  document.querySelector<HTMLInputElement>('#account-id');
const submitButton =
  document.querySelector<HTMLButtonElement>('.signup-submit');

const emailCheckButton =
  document.querySelector<HTMLButtonElement>('.field-action-email') ??
  getDuplicateCheckButton('email');

const passwordToggle = document.querySelector<HTMLButtonElement>(
  "[data-toggle='password']",
);
const passwordConfirmToggle = document.querySelector<HTMLButtonElement>(
  "[data-toggle='password-confirm']",
);

const kakaoLoginButton = document.querySelector<HTMLButtonElement>(
  "[data-role='kakao-login']",
);

const formStatus = document.querySelector<HTMLDivElement>('.form-status');

// 🔥 닉네임 필드(있으면 사용, 없으면 무시)
const nicknameField =
  document.querySelector<HTMLElement>("[data-field='nickname']") ?? null;

const emailField = document.querySelector<HTMLElement>("[data-field='email']");
const passwordField = document.querySelector<HTMLElement>(
  "[data-field='password']",
);
const passwordConfirmField = document.querySelector<HTMLElement>(
  "[data-field='passwordConfirm']",
);

const fieldElements = {
  nickname: nicknameField ?? undefined,
  email: emailField,
  password: passwordField,
  passwordConfirm: passwordConfirmField,
} as const;

type Field = keyof typeof fieldElements;
type FieldState = 'neutral' | 'success' | 'error' | 'info';

const duplicateState = {
  nicknameChecked: false,
  emailChecked: false,
};

const stateClassMap: Record<Exclude<FieldState, 'neutral'>, string> = {
  success: 'field-success',
  error: 'field-error',
  info: 'field-info',
};

function getDuplicateCheckButton(
  field: 'email' | 'nickname',
): HTMLButtonElement | null {
  const fieldSelector = `[data-field='${field}']`;
  const container = document.querySelector<HTMLElement>(fieldSelector);
  if (!container) return null;

  const actionButton =
    container.querySelector<HTMLButtonElement>('.field-action');
  if (actionButton) {
    return actionButton;
  }

  const textButton = Array.from(
    container.querySelectorAll<HTMLButtonElement>('button'),
  ).find(button => button.textContent?.trim() === '중복확인');

  return textButton ?? null;
}

function setFieldState(
  field: Field,
  state: FieldState = 'neutral',
  message: string = '',
): void {
  const fieldElement = fieldElements[field];
  if (!fieldElement) return;

  // 기존 상태 제거
  fieldElement.classList.remove('field-success', 'field-error', 'field-info');

  // neutral이 아닐 때만 상태 클래스 추가
  if (state !== 'neutral') {
    fieldElement.classList.add(stateClassMap[state]);
  }

  // 메시지 적용
  const messageElement =
    fieldElement.querySelector<HTMLParagraphElement>('.field-message');

  if (messageElement) {
    messageElement.textContent = message;
  }
}

function resetFieldStates(): void {
  (Object.keys(fieldElements) as Field[]).forEach(field => {
    setFieldState(field, 'neutral');
  });
}

function setFormStatus(
  message: string,
  type: 'success' | 'error' | 'info' = 'info',
): void {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.classList.remove('is-success', 'is-error');
  if (type === 'success') {
    formStatus.classList.add('is-success');
  } else if (type === 'error') {
    formStatus.classList.add('is-error');
  }
}

function checkEmailValueValidity(ignoreStateUpdate = false): boolean {
  if (!emailInput) {
    return false;
  }

  const value = emailInput.value.trim();

  if (value.length === 0) {
    if (!ignoreStateUpdate) {
      setFieldState('email', 'error', '이메일을 입력해주세요.');
    }
    return false;
  }

  if (!emailInput.checkValidity()) {
    if (!ignoreStateUpdate) {
      setFieldState('email', 'error', '올바른 이메일 형식이 아니에요.');
    }
    return false;
  }

  const localDuplicated = isEmailRegisteredLocally(value);
  if (localDuplicated) {
    duplicateState.emailChecked = false;
    if (!ignoreStateUpdate) {
      setFieldState('email', 'error', '이미 등록된 이메일입니다.');
      setFormStatus(
        '이미 등록된 이메일입니다. 다른 이메일을 입력해주세요.',
        'error',
      );
    }
    return false;
  }

  if (!ignoreStateUpdate) {
    if (!duplicateState.emailChecked) {
      setFieldState('email', 'info', '중복확인을 진행해주세요.');
    } else {
      setFieldState('email', 'success', '사용할 수 있는 이메일입니다.');
    }
  }

  return true;
}

function validateEmail(): boolean {
  const valueValid = checkEmailValueValidity(true);

  if (!valueValid) {
    checkEmailValueValidity(false);
    duplicateState.emailChecked = false;
    return false;
  }

  if (!duplicateState.emailChecked) {
    setFieldState('email', 'info', '중복확인을 진행해주세요.');
    return false;
  }

  setFieldState('email', 'success', '사용할 수 있는 이메일입니다.');
  return true;
}

function checkNicknameValueValidity(ignoreStateUpdate = false): boolean {
  if (!nicknameInput) {
    return false;
  }

  const value = nicknameInput.value.trim();

  if (value.length === 0) {
    if (!ignoreStateUpdate) {
      setFieldState('nickname', 'error', '별명을 입력해주세요.');
    }
    return false;
  }

  if (value.length < 2) {
    if (!ignoreStateUpdate) {
      setFieldState('nickname', 'error', '별명은 2자 이상으로 입력해주세요.');
    }
    return false;
  }

  if (value.length > 20) {
    if (!ignoreStateUpdate) {
      setFieldState('nickname', 'error', '20자 이하로 입력해주세요.');
    }
    return false;
  }

  const localDuplicated = isNicknameRegisteredLocally(value);
  if (localDuplicated) {
    duplicateState.nicknameChecked = false;
    if (!ignoreStateUpdate) {
      setFieldState('nickname', 'error', '이미 등록된 별명입니다.');
      setFormStatus(
        '이미 등록된 별명입니다. 다른 별명을 입력해주세요.',
        'error',
      );
    }
    return false;
  }

  if (!ignoreStateUpdate) {
    if (!duplicateState.nicknameChecked) {
      setFieldState('nickname', 'info', '중복확인을 진행해주세요.');
    } else {
      setFieldState('nickname', 'success', '사용할 수 있는 별명입니다.');
    }
  }

  return true;
}

function validateNickname(): boolean {
  const valueValid = checkNicknameValueValidity(true);

  if (!valueValid) {
    checkNicknameValueValidity(false);
    duplicateState.nicknameChecked = false;
    return false;
  }

  if (!duplicateState.nicknameChecked) {
    setFieldState('nickname', 'info', '중복확인을 진행해주세요.');
    return false;
  }

  setFieldState('nickname', 'success', '사용할 수 있는 별명입니다.');
  return true;
}

function validatePassword(updateState = true): boolean {
  if (!passwordInput) return false;

  const value = passwordInput.value;
  const ok = value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value);

  if (!updateState) return ok;

  if (!ok) {
    setFieldState(
      'password',
      'error',
      '대소문자, 숫자 조합 8자 이상이어야 합니다.',
    );
  } else {
    setFieldState('password', 'success', '좋은 비밀번호네요.');
  }

  return ok;
}

function validatePasswordConfirm(updateState = true): boolean {
  if (!passwordInput || !passwordConfirmInput) return false;

  const confirmValue = passwordConfirmInput.value;

  if (!confirmValue) {
    if (updateState)
      setFieldState(
        'passwordConfirm',
        'error',
        '비밀번호를 한 번 더 입력해주세요.',
      );
    return false;
  }

  if (!validatePassword(false)) {
    if (updateState)
      setFieldState(
        'passwordConfirm',
        'info',
        '먼저 비밀번호를 조건에 맞게 입력해주세요.',
      );
    return false;
  }

  if (passwordInput.value !== confirmValue) {
    if (updateState)
      setFieldState(
        'passwordConfirm',
        'error',
        '비밀번호가 일치하지 않습니다.',
      );
    return false;
  }

  if (updateState)
    setFieldState('passwordConfirm', 'success', '비밀번호가 일치합니다.');

  return true;
}

function updateSubmitState(): void {
  if (!submitButton) return;

  const emailValid = checkEmailValueValidity(true);
  const passwordValid = validatePassword(false);
  const confirmValid = validatePasswordConfirm(false);
  const nicknameValid =
    nicknameInput === null ? true : checkNicknameValueValidity(true); // 닉네임 입력이 없으면 검증 통과

  const canSubmit =
    emailValid &&
    passwordValid &&
    confirmValid &&
    duplicateState.emailChecked &&
    nicknameValid &&
    (nicknameInput === null ? true : duplicateState.nicknameChecked); // 닉네임 입력이 있으면 중복확인 필요

  submitButton.disabled = !canSubmit;
  submitButton.classList.toggle('is-active', canSubmit);
}

async function processRegistration(
  event: Event,
  trigger: HTMLButtonElement | null,
) {
  event.preventDefault();

  if (!form || !emailInput || !passwordInput || !passwordConfirmInput) return;

  const emailValid = validateEmail();
  const passwordValid = validatePassword();
  const confirmValid = validatePasswordConfirm();
  const nicknameValid = nicknameInput ? validateNickname() : true;

  if (!(emailValid && passwordValid && confirmValid && nicknameValid)) {
    setFormStatus('입력값을 다시 확인해주세요.', 'error');
    updateSubmitState();
    return;
  }

  if (!duplicateState.emailChecked) {
    setFormStatus('이메일 중복확인을 완료해주세요.', 'info');
    updateSubmitState();
    return;
  }

  // 닉네임 입력이 있으면 닉네임 중복확인도 체크
  if (nicknameInput && !duplicateState.nicknameChecked) {
    setFormStatus('별명 중복확인을 완료해주세요.', 'info');
    updateSubmitState();
    return;
  }

  const emailValue = emailInput.value.trim();
  const nicknameValue = nicknameInput?.value.trim() ?? '';

  if (isEmailRegisteredLocally(emailValue)) {
    duplicateState.emailChecked = false;
    setFieldState('email', 'error', '이미 사용 중인 이메일입니다.');
    setFormStatus(
      '이미 등록된 이메일입니다. 다른 이메일을 입력해주세요.',
      'error',
    );
    updateSubmitState();
    return;
  }

  // 닉네임이 입력되어 있고, 로컬에 중복된 닉네임이 있으면 체크
  if (nicknameValue && isNicknameRegisteredLocally(nicknameValue)) {
    duplicateState.nicknameChecked = false;
    setFieldState('nickname', 'error', '이미 사용 중인 별명입니다.');
    setFormStatus('이미 등록된 별명입니다. 다른 별명을 입력해주세요.', 'error');
    updateSubmitState();
    return;
  }

  try {
    const duplicatedOnServer = await isEmailRegisteredInDb(emailValue);
    if (duplicatedOnServer) {
      duplicateState.emailChecked = false;
      setFieldState('email', 'error', '이미 사용 중인 이메일입니다.');
      setFormStatus(
        '이미 등록된 이메일입니다. 다른 이메일을 입력해주세요.',
        'error',
      );
      updateSubmitState();
      return;
    }
  } catch (error) {
    duplicateState.emailChecked = false;
    const message =
      error instanceof Error
        ? error.message
        : '이메일 중복확인 중 오류가 발생했습니다.';
    setFormStatus(message, 'error');
    setFieldState('email', 'info', '잠시 후 다시 시도해주세요.');
    updateSubmitState();
    return;
  }

  // 닉네임이 입력되어 있으면 서버 중복확인도 체크
  if (nicknameValue) {
    try {
      const nicknameDuplicatedOnServer =
        await isNameRegisteredInDb(nicknameValue);
      if (nicknameDuplicatedOnServer) {
        duplicateState.nicknameChecked = false;
        setFieldState('nickname', 'error', '이미 사용 중인 별명입니다.');
        setFormStatus(
          '이미 등록된 별명입니다. 다른 별명을 입력해주세요.',
          'error',
        );
        updateSubmitState();
        return;
      }
    } catch (error) {
      // 409 에러는 isNameRegisteredInDb에서 이미 처리되므로 여기까지 오면 실제 서버 오류
      duplicateState.nicknameChecked = false;
      console.error('[signup] 별명 서버 중복 확인 실패:', error);
      const axiosError = error as {
        response?: {
          status?: number;
          data?: { message?: string };
        };
      };

      // 409 에러는 이미 중복으로 처리됨 (안전장치)
      if (axiosError?.response?.status === 409) {
        duplicateState.nicknameChecked = false;
        setFieldState('nickname', 'error', '이미 사용 중인 별명입니다.');
        setFormStatus(
          '이미 등록된 별명입니다. 다른 별명을 입력해주세요.',
          'error',
        );
        updateSubmitState();
        return;
      }

      const message =
        axiosError?.response?.data?.message ??
        (error instanceof Error ? error.message : null) ??
        '별명 중복확인 중 오류가 발생했습니다.';
      setFormStatus(message, 'error');
      setFieldState('nickname', 'info', '잠시 후 다시 시도해주세요.');
      updateSubmitState();
      return;
    }
  }

  setFormStatus('회원가입을 진행 중입니다...', 'info');

  trigger?.setAttribute('aria-busy', 'true');
  if (trigger) trigger.disabled = true;

  try {
    const payload: User = {
      email: emailValue,
      name: nicknameInput?.value,
      password: passwordInput.value,
      type: memberTypeInput?.value ?? 'user',
      ...(imageInput?.value ? { image: imageInput.value.trim() } : {}),
      ...(providerAccountIdInput?.value
        ? { extra: { providerAccountId: providerAccountIdInput.value.trim() } }
        : {}),
    };

    const response = await registerUser(payload);

    if (!response.ok) {
      const msg = response.message ?? '회원가입에 실패했습니다.';
      if (msg.includes('이메일')) {
        duplicateState.emailChecked = false;
        setFieldState('email', 'error', msg);
      }
      setFormStatus(msg, 'error');
      return;
    }

    // ✅ 회원가입 성공 시 서버에서 받은 실제 토큰만 사용
    const userData = response.data ?? response.item;
    const receivedToken = response.token;

    console.log('[signup] ✅ 회원가입 성공');
    console.log('[signup] 서버 응답:', response);

    if (!receivedToken) {
      console.warn(
        '[signup] ⚠️ 서버에서 토큰을 받지 못했습니다. 로그인 페이지로 이동합니다.',
      );
      setFormStatus('회원가입은 완료되었지만 로그인이 필요합니다.', 'info');

      // 약간의 지연 후 로그인 페이지로 이동
      setTimeout(() => {
        window.location.href = '/src/features/login/login.html';
      }, 2000);
      return;
    }

    console.log(
      '[signup] ✅ 서버에서 받은 토큰:',
      receivedToken.substring(0, 50) + '...',
    );
    saveToken(receivedToken, userData?.email ?? emailValue, userData?.name);

    setFormStatus('회원가입이 완료되었습니다!', 'success');
    form.reset();
    duplicateState.emailChecked = false;
    resetFieldStates();

    addLocalRegisteredUser({
      email: emailValue,
      nickname: nicknameInput?.value.trim() ?? emailValue.split('@')[0],
      provider: 'local',
      type: memberTypeInput?.value ?? 'user',
      password: passwordInput.value,
    });

    passwordInput.type = 'password';
    passwordConfirmInput.type = 'password';
    passwordToggle?.classList.remove('is-visible');
    passwordConfirmToggle?.classList.remove('is-visible');
  } catch {
    setFormStatus('회원가입 처리 중 오류가 발생했습니다.', 'error');
  } finally {
    trigger?.removeAttribute('aria-busy');
    if (trigger) trigger.disabled = false;
    updateSubmitState();
  }
}

function initEventListeners() {
  emailInput?.addEventListener('input', () => {
    duplicateState.emailChecked = false;
    checkEmailValueValidity();
    updateSubmitState();
  });

  emailInput?.addEventListener('blur', () => {
    checkEmailValueValidity();
  });

  emailCheckButton?.addEventListener('click', async () => {
    if (!checkEmailValueValidity()) {
      duplicateState.emailChecked = false;
      updateSubmitState();
      return;
    }

    const emailValue = emailInput?.value.trim() ?? '';

    if (isEmailRegisteredLocally(emailValue)) {
      duplicateState.emailChecked = false;
      setFieldState('email', 'error', '이미 사용 중인 이메일입니다.');
      setFormStatus(
        '이미 등록된 이메일입니다. 다른 이메일을 입력해주세요.',
        'error',
      );
      updateSubmitState();
      return;
    }

    try {
      const duplicatedOnServer = await isEmailRegisteredInDb(emailValue);
      if (duplicatedOnServer) {
        duplicateState.emailChecked = false;
        setFieldState('email', 'error', '이미 사용 중인 이메일입니다.');
        setFormStatus(
          '이미 등록된 이메일입니다. 다른 이메일을 입력해주세요.',
          'error',
        );
        updateSubmitState();
        return;
      }
    } catch {
      duplicateState.emailChecked = false;
      setFormStatus('중복확인 중 오류가 발생했습니다.', 'error');
      setFieldState('email', 'info', '잠시 후 다시 시도해주세요.');
      updateSubmitState();
      return;
    }

    duplicateState.emailChecked = true;
    setFieldState('email', 'success', '사용할 수 있는 이메일입니다.');
    setFormStatus('이메일 중복확인을 완료했어요.', 'info');
    updateSubmitState();
  });

  // 닉네임 중복확인 버튼(옵션)
  const nicknameCheckButton =
    document.querySelector<HTMLButtonElement>('.field-action-nickname') ??
    getDuplicateCheckButton('nickname');
  nicknameCheckButton?.addEventListener('click', async () => {
    if (!checkNicknameValueValidity()) {
      duplicateState.nicknameChecked = false;
      updateSubmitState();
      return;
    }

    const nicknameValue = nicknameInput?.value.trim() ?? '';
    if (nicknameValue.length === 0) {
      duplicateState.nicknameChecked = false;
      setFieldState('nickname', 'error', '별명을 입력해주세요.');
      updateSubmitState();
      return;
    }

    if (isNicknameRegisteredLocally(nicknameValue)) {
      duplicateState.nicknameChecked = false;
      setFieldState('nickname', 'error', '이미 사용 중인 별명입니다.');
      setFormStatus(
        '이미 등록된 별명입니다. 다른 별명을 입력해주세요.',
        'error',
      );
      updateSubmitState();
      return;
    }

    try {
      const duplicatedOnServer = await isNameRegisteredInDb(nicknameValue);
      if (duplicatedOnServer) {
        duplicateState.nicknameChecked = false;
        setFieldState('nickname', 'error', '이미 사용 중인 별명입니다.');
        setFormStatus(
          '이미 등록된 별명입니다. 다른 별명을 입력해주세요.',
          'error',
        );
        updateSubmitState();
        return;
      }
    } catch (error) {
      // 409 에러는 isNameRegisteredInDb에서 이미 처리되므로 여기까지 오면 실제 서버 오류
      duplicateState.nicknameChecked = false;
      console.error('[signup] 별명 서버 중복 확인 실패:', error);
      const axiosError = error as {
        response?: {
          status?: number;
          data?: { message?: string };
        };
      };

      // 409 에러는 이미 중복으로 처리됨 (안전장치)
      if (axiosError?.response?.status === 409) {
        duplicateState.nicknameChecked = false;
        setFieldState('nickname', 'error', '이미 사용 중인 별명입니다.');
        setFormStatus(
          '이미 등록된 별명입니다. 다른 별명을 입력해주세요.',
          'error',
        );
        updateSubmitState();
        return;
      }

      const message =
        axiosError?.response?.data?.message ??
        (error instanceof Error ? error.message : null) ??
        '중복확인 중 오류가 발생했습니다.';
      setFormStatus(message, 'error');
      setFieldState('nickname', 'info', '잠시 후 다시 시도해주세요.');
      updateSubmitState();
      return;
    }

    duplicateState.nicknameChecked = true;
    setFieldState('nickname', 'success', '사용할 수 있는 별명입니다.');
    setFormStatus('별명 중복확인을 완료했어요.', 'info');
    updateSubmitState();
  });

  // 닉네임 입력 변화 시 상태 초기화(옵션)
  nicknameInput?.addEventListener('input', () => {
    duplicateState.nicknameChecked = false;
    checkNicknameValueValidity();
    updateSubmitState();
  });

  nicknameInput?.addEventListener('blur', () => {
    checkNicknameValueValidity();
  });

  passwordInput?.addEventListener('input', () => {
    validatePassword();
    validatePasswordConfirm();
    updateSubmitState();
  });

  passwordConfirmInput?.addEventListener('input', () => {
    validatePasswordConfirm();
    updateSubmitState();
  });

  passwordToggle?.addEventListener('click', () => {
    togglePasswordVisibility(passwordToggle, passwordInput);
  });

  passwordConfirmToggle?.addEventListener('click', () => {
    togglePasswordVisibility(passwordConfirmToggle, passwordConfirmInput);
  });

  form?.addEventListener('submit', e => {
    void processRegistration(e, submitButton);
  });
}

function togglePasswordVisibility(
  btn: HTMLButtonElement | null,
  input: HTMLInputElement | null,
) {
  if (!btn || !input) return;
  const nextType = input.type === 'password' ? 'text' : 'password';
  input.type = nextType;
  const visible = nextType === 'text';
  btn.classList.toggle('is-visible', visible);
  btn.setAttribute('aria-pressed', String(visible));
}

kakaoLoginButton?.addEventListener('click', () => {
  const url =
    `https://kauth.kakao.com/oauth/authorize?response_type=code` +
    `&client_id=${KAKAO_REST_API_KEY}` +
    `&redirect_uri=${encodeURIComponent(KAKAO_REDIRECT_URI)}` +
    `&scope=account_email,gender`;
  window.location.href = url;
});

initEventListeners();
updateSubmitState();
