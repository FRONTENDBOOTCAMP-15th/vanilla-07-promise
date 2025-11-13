// ✅ axios 임포트 (타입 자동 인식)
import axios from 'axios';

interface AxiosErrorLike {
  response?: {
    data?: unknown;
  };
}

const isAxiosError = (error: unknown): error is AxiosErrorLike => {
  return typeof error === 'object' && error !== null && 'response' in error;
};

// ✅ 환경변수 (Vite 전용)
const metaEnv =
  (import.meta as unknown as { env?: Record<string, string | undefined> })
    .env ?? {};
const API_SERVER = metaEnv.VITE_API_SERVER;

// ✅ Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_SERVER,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'client-id': metaEnv.VITE_CLIENT_ID ?? '',
  },
});

const LOCAL_USERS_STORAGE_KEY = 'vanilla:signup:users';

export type ProviderVariant = 'local' | 'kakao';

export interface LocalRegisteredUser {
  email: string;
  nickname: string;
  provider: ProviderVariant | string;
  type: string;
}

const normalizeValue = (value: string): string => value.trim().toLowerCase();

const isValidLocalUser = (item: unknown): item is LocalRegisteredUser => {
  if (typeof item !== 'object' || item === null) {
    return false;
  }
  const candidate = item as Record<string, unknown>;
  return (
    typeof candidate.email === 'string' &&
    typeof candidate.nickname === 'string' &&
    typeof candidate.provider === 'string' &&
    typeof candidate.type === 'string'
  );
};

export const loadLocalRegisteredUsers = (): LocalRegisteredUser[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(LOCAL_USERS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isValidLocalUser).map(user => ({
      email: normalizeValue((user as LocalRegisteredUser).email),
      nickname: normalizeValue((user as LocalRegisteredUser).nickname),
      provider: (user as LocalRegisteredUser).provider,
      type: (user as LocalRegisteredUser).type,
    }));
  } catch (error) {
    console.warn('[apiClient] Failed to load local registered users:', error);
    return [];
  }
};

const storeLocalRegisteredUsers = (users: LocalRegisteredUser[]): void => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(
      LOCAL_USERS_STORAGE_KEY,
      JSON.stringify(
        users.map(user => ({
          email: normalizeValue(user.email),
          nickname: normalizeValue(user.nickname),
          provider: user.provider,
          type: user.type,
        })),
      ),
    );
  } catch (error) {
    console.warn('[apiClient] Failed to store local registered users:', error);
  }
};

export const addLocalRegisteredUser = (user: LocalRegisteredUser): void => {
  const current = loadLocalRegisteredUsers();
  current.push({
    email: normalizeValue(user.email),
    nickname: normalizeValue(user.nickname),
    provider: user.provider,
    type: user.type,
  });
  storeLocalRegisteredUsers(current);
};

export const isEmailRegisteredLocally = (email: string): boolean => {
  const normalized = normalizeValue(email);
  return loadLocalRegisteredUsers().some(user => user.email === normalized);
};

export const isNicknameRegisteredLocally = (nickname: string): boolean => {
  const normalized = normalizeValue(nickname);
  return loadLocalRegisteredUsers().some(user => user.nickname === normalized);
};

// ✅ 타입 정의
export interface User {
  _id?: string;
  email: string;
  name: string;
  password?: string;
  provider?: string;
  type?: string;
  image?: string | null;
  extra?: {
    providerAccountId?: string;
    [key: string]: unknown;
  };
  createdAt?: string;
  updatedAt?: string;
}

// ✅ 응답 타입 정의
export interface ApiItemResponse<T> {
  ok: boolean;
  message?: string;
  data?: T;
  item?: T;
}

export interface ApiListResponse<T> {
  ok: boolean;
  message?: string;
  data?: T[];
  items?: T[];
}

// ✅ 회원가입
export const registerUser = async (
  userData: User,
): Promise<ApiItemResponse<User>> => {
  try {
    const extraPayload = { ...(userData.extra ?? {}) };
    if (!extraPayload.providerAccountId) delete extraPayload.providerAccountId;

    const payload = {
      email: userData.email,
      password: userData.password,
      name: userData.name,
      type: userData.type ?? 'user',
      loginType: userData.provider ?? 'local',
      ...(userData.image && { image: userData.image }),
      ...(Object.keys(extraPayload).length > 0 && { extra: extraPayload }),
    };

    const { data } = await api.post<ApiItemResponse<User>>('/users', payload);
    return data;
  } catch (err) {
    if (isAxiosError(err)) {
      console.error('[registerUser] 요청 실패:', err.response?.data);
    }
    throw err;
  }
};

// ✅ 회원 목록 조회
export const getUserList = async (): Promise<ApiListResponse<User>> => {
  const { data } = await api.get<ApiListResponse<User>>('/users');
  return data;
};

// ✅ 회원 상세 조회
export const getUserById = async (
  id: string,
): Promise<ApiItemResponse<User>> => {
  const { data } = await api.get<ApiItemResponse<User>>(`/users/${id}`);
  return data;
};

// ✅ 회원 정보 수정
export const updateUser = async (
  id: string,
  updateData: Partial<User>,
): Promise<ApiItemResponse<User>> => {
  const { data } = await api.put<ApiItemResponse<User>>(
    `/users/${id}`,
    updateData,
  );
  return data;
};

// ✅ 일반 로그인
export const loginUser = async (loginData: {
  email: string;
  password: string;
}): Promise<ApiItemResponse<User>> => {
  try {
    const { data } = await api.post<ApiItemResponse<User>>(
      '/users/login',
      loginData,
    );
    return data;
  } catch (err) {
    if (isAxiosError(err)) {
      console.error('[loginUser] 로그인 실패:', err.response?.data);
    }
    throw err;
  }
};

// ✅ 카카오 로그인
export const loginKakao = async (): Promise<ApiItemResponse<unknown>> => {
  try {
    const { data } =
      await api.get<ApiItemResponse<unknown>>('/users/login/kakao');
    return data;
  } catch (err) {
    if (isAxiosError(err)) {
      console.error('[loginKakao] 요청 실패:', err.response?.data);
    }
    throw err;
  }
};

// ✅ 카카오 로그인 콜백
export const loginKakaoCallback = async (
  code: string,
): Promise<ApiItemResponse<User>> => {
  try {
    const { data } = await api.post<ApiItemResponse<User>>(
      '/users/login/kakao/callback',
      { code },
    );
    return data;
  } catch (err) {
    if (isAxiosError(err)) {
      console.error('[loginKakaoCallback] 실패:', err.response?.data);
    }
    throw err;
  }
};

// ✅ export 모듈
export default {
  registerUser,
  getUserList,
  getUserById,
  updateUser,
  loginUser,
  loginKakao,
  loginKakaoCallback,
};
