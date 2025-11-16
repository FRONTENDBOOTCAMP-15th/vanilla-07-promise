import {
  addLocalRegisteredUser,
  isEmailRegisteredLocally,
  isNicknameRegisteredLocally,
  registerUser,
  type User,
} from '../../types/apiClient.ts';

const metaEnv =
  (import.meta as unknown as { env?: Record<string, string | undefined> })
    .env ?? {};
const KAKAO_REST_API_KEY = metaEnv.VITE_KAKAO_REST_API_KEY ?? '';
const KAKAO_REDIRECT_URI = metaEnv.VITE_KAKAO_REDIRECT_URI ?? '';

const form = document.querySelector<HTMLFormElement>('#signup-form');
const nicknameInput =
  document.querySelector<HTMLInputElement>('#nickname-input');
const emailInput = document.querySelector<HTMLInputElement>('#email-input');
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
const nicknameCheckButton = document.querySelector<HTMLButtonElement>(
  "[data-action='nickname-check']",
);
const emailCheckButton = document.querySelector<HTMLButtonElement>(
  "[data-action='email-check']",
);
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

const fieldElements = {
  nickname: document.querySelector<HTMLElement>("[data-field='nickname']"),
  email: document.querySelector<HTMLElement>("[data-field='email']"),
  password: document.querySelector<HTMLElement>("[data-field='password']"),
  passwordConfirm: document.querySelector<HTMLElement>(
    "[data-field='passwordConfirm']",
  ),
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

function setFieldState(field: Field, state: FieldState, message = ''): void {
  const fieldElement = fieldElements[field];
  if (!fieldElement) {
    return;
  }

  fieldElement.classList.remove('field-success', 'field-error', 'field-info');

  if (state !== 'neutral') {
    fieldElement.classList.add(stateClassMap[state]);
  }

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
  if (!formStatus) {
    return;
  }

  formStatus.textContent = message;
  formStatus.classList.remove('is-success', 'is-error');

  if (type === 'success') {
    formStatus.classList.add('is-success');
  } else if (type === 'error') {
    formStatus.classList.add('is-error');
  }
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

  const nicknameDuplicated = isNicknameRegisteredLocally(value);
  if (nicknameDuplicated) {
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

  const emailDuplicated = isEmailRegisteredLocally(value);
  if (emailDuplicated) {
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

function validatePassword(updateState = true): boolean {
  if (!passwordInput) {
    return false;
  }

  const value = passwordInput.value;
  const hasLetter = /[A-Za-z]/.test(value);
  const hasNumber = /\d/.test(value);
  const isValid = value.length >= 8 && hasLetter && hasNumber;

  if (!updateState) {
    return isValid;
  }

  if (!isValid) {
    setFieldState(
      'password',
      'error',
      '대소문자, 숫자 조합 8자 이상이어야 합니다.',
    );
    return false;
  }

  setFieldState('password', 'success', '좋은 비밀번호네요.');
  return true;
}

function validatePasswordConfirm(updateState = true): boolean {
  if (!passwordInput || !passwordConfirmInput) {
    return false;
  }

  const value = passwordConfirmInput.value;
  const passwordValid = validatePassword(false);

  if (value.length === 0) {
    if (updateState) {
      setFieldState(
        'passwordConfirm',
        'error',
        '비밀번호를 한 번 더 입력해주세요.',
      );
    }
    return false;
  }

  if (!passwordValid) {
    if (updateState) {
      setFieldState(
        'passwordConfirm',
        'info',
        '먼저 비밀번호를 조건에 맞게 입력해주세요.',
      );
    }
    return false;
  }

  if (passwordInput.value !== value) {
    if (updateState) {
      setFieldState(
        'passwordConfirm',
        'error',
        '비밀번호가 일치하지 않습니다.',
      );
    }
    return false;
  }

  if (updateState) {
    setFieldState('passwordConfirm', 'success', '비밀번호가 일치합니다.');
  }
  return true;
}

function updateSubmitState(): void {
  if (!submitButton) {
    return;
  }

  const nicknameValueValid = checkNicknameValueValidity(true);
  const emailValueValid = checkEmailValueValidity(true);
  const passwordValueValid = validatePassword(false);
  const confirmValueValid = validatePasswordConfirm(false);

  const canSubmit =
    nicknameValueValid &&
    emailValueValid &&
    passwordValueValid &&
    confirmValueValid &&
    duplicateState.nicknameChecked &&
    duplicateState.emailChecked;

  submitButton.disabled = !canSubmit;
  submitButton.classList.toggle('is-active', canSubmit);
}

function togglePasswordVisibility(
  button: HTMLButtonElement | null,
  targetInput: HTMLInputElement | null,
): void {
  if (!button || !targetInput) {
    return;
  }

  const nextType = targetInput.type === 'password' ? 'text' : 'password';
  targetInput.type = nextType;

  const isVisible = nextType === 'text';
  button.classList.toggle('is-visible', isVisible);
  button.setAttribute('aria-pressed', String(isVisible));
}

async function processRegistration(
  event: Event,
  triggerButton: HTMLButtonElement | null,
): Promise<void> {
  event.preventDefault();

  if (!form || !nicknameInput || !emailInput || !passwordInput || !passwordConfirmInput) {
    return;
  }

  const nicknameValid = validateNickname();
  const emailValid = validateEmail();
  const passwordValid = validatePassword();
  const confirmValid = validatePasswordConfirm();

  if (!(nicknameValid && emailValid && passwordValid && confirmValid)) {
    setFormStatus('입력값을 다시 확인해주세요.', 'error');
    updateSubmitState();
    return;
  }

  if (!duplicateState.nicknameChecked || !duplicateState.emailChecked) {
    setFormStatus('닉네임과 이메일의 중복확인을 완료해주세요.', 'info');
    updateSubmitState();
    return;
  }

  const nicknameValue = nicknameInput.value.trim();
  const emailValue = emailInput.value.trim();

  if (isNicknameRegisteredLocally(nicknameValue)) {
    duplicateState.nicknameChecked = false;
    setFieldState('nickname', 'error', '이미 사용 중인 별명입니다.');
    setFormStatus('이미 등록된 별명입니다. 다른 별명을 입력해주세요.', 'error');
    updateSubmitState();
    return;
  }

  if (isEmailRegisteredLocally(emailValue)) {
    duplicateState.emailChecked = false;
    setFieldState('email', 'error', '이미 사용 중인 이메일입니다.');
    setFormStatus('이미 등록된 이메일입니다. 다른 이메일을 입력해주세요.', 'error');
    updateSubmitState();
    return;
  }

  setFormStatus('회원가입을 진행 중입니다...', 'info');

  if (triggerButton) {
    triggerButton.setAttribute('aria-busy', 'true');
    triggerButton.disabled = true;
  }

  try {
    const imageValue = imageInput?.value?.trim() ?? '';
    const providerAccountIdValue = providerAccountIdInput?.value?.trim() ?? '';

    const payload: User = {
      email: emailValue,
      name: nicknameValue,
      password: passwordInput.value,
      type: memberTypeInput?.value ?? 'user',
      provider: 'local',
      ...(imageValue ? { image: imageValue } : {}),
      ...(providerAccountIdValue
        ? { extra: { providerAccountId: providerAccountIdValue } }
        : {}),
    };

    const response = await registerUser(payload);

    if (!response.ok) {
      const message = response.message ?? '회원가입에 실패했습니다.';
      if (message.includes('이메일')) {
        duplicateState.emailChecked = false;
        setFieldState('email', 'error', message);
      }
      if (message.includes('별명') || message.includes('닉네임')) {
        duplicateState.nicknameChecked = false;
        setFieldState('nickname', 'error', message);
      }
      setFormStatus(message, 'error');
      return;
    }

    setFormStatus('회원가입이 완료되었습니다!', 'success');
    form.reset();
    duplicateState.nicknameChecked = false;
    duplicateState.emailChecked = false;
    resetFieldStates();

    addLocalRegisteredUser({
      email: emailValue,
      nickname: nicknameValue,
      provider: 'local',
      type: memberTypeInput?.value ?? 'user',
      password: passwordInput.value,
    });

    passwordInput.type = 'password';
    passwordConfirmInput.type = 'password';
    passwordToggle?.classList.remove('is-visible');
    passwordConfirmToggle?.classList.remove('is-visible');
  } catch (error) {
    console.error('[processRegistration] 회원가입 요청 실패:', error);
    const axiosError = error as {
      response?: {
        data?: { message?: string; errors?: Record<string, string> };
      };
    };

    const serverMessage =
      axiosError?.response?.data?.message ||
      axiosError?.response?.data?.errors?.email ||
      axiosError?.response?.data?.errors?.nickname;

    if (serverMessage) {
      if (serverMessage.includes('이메일')) {
        duplicateState.emailChecked = false;
        setFieldState('email', 'error', serverMessage);
      }
      if (serverMessage.includes('별명') || serverMessage.includes('닉네임')) {
        duplicateState.nicknameChecked = false;
        setFieldState('nickname', 'error', serverMessage);
      }
      setFormStatus(serverMessage, 'error');
    } else {
      setFormStatus('회원가입 처리 중 오류가 발생했습니다.', 'error');
    }
  } finally {
    if (triggerButton) {
      triggerButton.removeAttribute('aria-busy');
      triggerButton.disabled = false;
    }
    updateSubmitState();
  }
}

async function handleSubmit(event: SubmitEvent): Promise<void> {
  await processRegistration(event, submitButton);
}


function initEventListeners(): void {
  nicknameInput?.addEventListener('input', () => {
    duplicateState.nicknameChecked = false;
    checkNicknameValueValidity();
    updateSubmitState();
  });

  nicknameInput?.addEventListener('blur', () => {
    checkNicknameValueValidity();
  });

  nicknameCheckButton?.addEventListener('click', () => {
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

    duplicateState.nicknameChecked = true;
    setFieldState('nickname', 'success', '사용할 수 있는 별명입니다.');
    setFormStatus('별명 중복확인을 완료했어요.', 'info');
    updateSubmitState();
  });

  emailInput?.addEventListener('input', () => {
    duplicateState.emailChecked = false;
    checkEmailValueValidity();
    updateSubmitState();
  });

  emailInput?.addEventListener('blur', () => {
    checkEmailValueValidity();
  });

  emailCheckButton?.addEventListener('click', () => {
    if (!checkEmailValueValidity()) {
      duplicateState.emailChecked = false;
      updateSubmitState();
      return;
    }

    const emailValue = emailInput?.value.trim() ?? '';
    if (emailValue.length === 0) {
      duplicateState.emailChecked = false;
      setFieldState('email', 'error', '이메일을 입력해주세요.');
      updateSubmitState();
      return;
    }

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

    duplicateState.emailChecked = true;
    setFieldState('email', 'success', '사용할 수 있는 이메일입니다.');
    setFormStatus('이메일 중복확인을 완료했어요.', 'info');
    updateSubmitState();
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

  passwordConfirmInput?.addEventListener('blur', () => {
    validatePasswordConfirm();
  });

  passwordToggle?.addEventListener('click', () => {
    togglePasswordVisibility(passwordToggle, passwordInput);
  });

  passwordConfirmToggle?.addEventListener('click', () => {
    togglePasswordVisibility(passwordConfirmToggle, passwordConfirmInput);
  });

  form?.addEventListener('submit', event => {
    void handleSubmit(event);
  });

}
kakaoLoginButton?.addEventListener('click', () => {
  const redirectUrl =
    `https://kauth.kakao.com/oauth/authorize?response_type=code` +
    `&client_id=${KAKAO_REST_API_KEY}` +
    `&redirect_uri=${encodeURIComponent(KAKAO_REDIRECT_URI)}` +
    `&scope=account_email,gender`;

  window.location.href = redirectUrl;
});

initEventListeners();
updateSubmitState();
