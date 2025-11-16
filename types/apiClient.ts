// ✅ axios 임포트 (타입 자동 인식)
import axios from 'axios';
import { TEMP_TOKEN } from '../src/common/token';

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

// ✅ Axios 인스턴스 생성 (client-id 및 인증 헤더 포함)
export const api = axios.create({
  baseURL: API_SERVER,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'client-id': metaEnv.VITE_CLIENT_ID ?? '',
    ...(typeof TEMP_TOKEN === 'string' && TEMP_TOKEN
      ? { Authorization: `Bearer ${TEMP_TOKEN}` }
      : {}),
  },
});

const LOCAL_USERS_STORAGE_KEY = 'vanilla:signup:users';

export type ProviderVariant = 'local' | 'kakao';

export interface LocalRegisteredUser {
  email: string;
  nickname: string;
  image?: string;
  type: string;
  password?: string;
  provider?: ProviderVariant;
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
    typeof candidate.type === 'string' &&
    (typeof candidate.provider === 'string' ||
      typeof candidate.provider === 'undefined')
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
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return (parsed as unknown[]).filter(isValidLocalUser).map(u => ({
      email: normalizeValue(u.email),
      nickname: normalizeValue(u.nickname),
      image: typeof u.image === 'string' ? u.image : undefined,
      type: u.type,
      password: typeof u.password === 'string' ? u.password : undefined,
      ...(typeof u.provider === 'string'
        ? { provider: u.provider as ProviderVariant }
        : {}),
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
        users.map(u => ({
          email: normalizeValue(u.email),
          nickname: normalizeValue(u.nickname),
          image: u.image,
          type: u.type,
          password: u.password,
          ...(u.provider ? { provider: u.provider } : {}),
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
    image: user.image,
    type: user.type,
    password: user.password,
    ...(user.provider ? { provider: user.provider } : {}),
  });
  storeLocalRegisteredUsers(current);
};

export const isEmailRegisteredLocally = (email: string): boolean => {
  const normalized = normalizeValue(email);
  return loadLocalRegisteredUsers().some(u => u.email === normalized);
};

export const isNicknameRegisteredLocally = (nickname: string): boolean => {
  const normalized = normalizeValue(nickname);
  return loadLocalRegisteredUsers().some(u => u.nickname === normalized);
};

export const findLocalRegisteredUser = (
  email: string,
): LocalRegisteredUser | undefined => {
  const normalized = normalizeValue(email);
  return loadLocalRegisteredUsers().find(u => u.email === normalized);
};

export interface ApiResponse<T> {
  ok: boolean;
  message?: string;
  data?: T;
  item?: T;
  token?: string;
}

export interface KakaoTokenResponse {
  token_type: string;
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  refresh_token_expires_in?: number;
  scope?: string;
}

export interface KakaoUserAccount {
  email?: string;
  gender?: string;
}

export interface KakaoUserProfile {
  nickname?: string;
  profile_image_url?: string;
}

export interface KakaoUserResponse {
  id: number;
  kakao_account?: KakaoUserAccount;
  properties?: KakaoUserProfile;
}

export interface User {
  _id?: string;
  email: string;
  password?: string;
  name?: string;
  image?: string;
  type?: string;
  extra?: Record<string, unknown>;
  provider?: string;
}

// ===================================================
// 1) ⭐ 일반 로그인 API (항상 200) — 서버 변경 후 완전 호환
// ===================================================
export const loginUser = async (payload: {
  email: string;
  password: string;
}): Promise<ApiResponse<User>> => {
  try {
    const { data } = await api.post<ApiResponse<User>>('/users/login', payload);
    // 항상 200이므로 throw 없음
    return data;
  } catch (err) {
    if (isAxiosError(err) && err.response?.data) {
      return err.response.data as ApiResponse<User>;
    }
    console.error('[loginUser] 서버 오류:', err);
    return {
      ok: false,
      message: '서버 오류가 발생했습니다.',
    };
  }
};

// ===================================================
// 2) ⭐ 카카오 토큰 요청 (POST /auth/kakao/token)
// ===================================================
export const getKakaoToken = async (
  code: string,
): Promise<KakaoTokenResponse | ApiResponse<null>> => {
  try {
    const { data } = await api.post<KakaoTokenResponse | ApiResponse<null>>(
      '/auth/kakao/token',
      { code },
    );
    return data;
  } catch (err) {
    console.error('[getKakaoToken] 오류:', err);
    return {
      ok: false,
      message: '카카오 토큰 요청 실패',
      data: null,
    };
  }
};

// ===================================================
// 3) ⭐ 카카오 유저 정보 요청 (POST /auth/kakao/userinfo)
// ===================================================
export const getKakaoUserInfo = async (
  accessToken: string,
): Promise<KakaoUserResponse | ApiResponse<null>> => {
  try {
    const { data } = await api.post<KakaoUserResponse | ApiResponse<null>>(
      '/auth/kakao/userinfo',
      {
        access_token: accessToken,
      },
    );
    return data;
  } catch (err) {
    console.error('[getKakaoUserInfo] 오류:', err);
    return {
      ok: false,
      message: '카카오 유저 정보 요청 실패',
      data: null,
    };
  }
};

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
    const extraPayload = { ...(userData.extra ?? {}) } as Record<
      string,
      unknown
    >;
    if (!('providerAccountId' in extraPayload)) {
      // nothing to send
    }

    const payload = {
      email: userData.email,
      password: userData.password,
      name: userData.name,
      type: userData.type ?? 'user',
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
