// ✅ axios 임포트 (타입 자동 인식)
import axios from 'axios';

interface AxiosErrorLike {
  response?: {
    data?: unknown;
    status?: number;
  };
}

const isAxiosError = (error: unknown): error is AxiosErrorLike => {
  return typeof error === 'object' && error !== null && 'response' in error;
};

// ✅ 환경변수 (Vite 전용)
const metaEnv =
  (import.meta as unknown as { env?: Record<string, string | undefined> })
    .env ?? {};
const API_SERVER =
  metaEnv.VITE_API_SERVER || 'https://fesp-api.koyeb.app/market';

// ✅ Axios 인스턴스 생성 (client-id 및 인증 헤더 포함)
export const api = axios.create({
  baseURL: API_SERVER,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'client-id': metaEnv.VITE_CLIENT_ID || 'febc15-vanilla07-ecad',
  },
});

// FormData를 사용하는 요청 및 인증 토큰을 위한 인터셉터 추가
api.interceptors.request.use(
  config => {
    // 인증 토큰 자동 추가
    const accessToken = tokenStore.getAccessToken();
    if (accessToken && config.headers) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    // FormData를 사용하는 경우 (multipart/form-data)
    // 기본 Content-Type 헤더를 제거하여 axios가 자동으로 boundary를 포함한 헤더를 설정하도록 함
    if (config.data instanceof FormData) {
      // 헤더에서 Content-Type 제거 (axios가 자동 설정)
      if (config.headers) {
        delete config.headers['Content-Type'];
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

const LOCAL_USERS_STORAGE_KEY = 'vanilla:signup:users';

export type ProviderVariant = 'local' | 'kakao';

export interface LocalRegisteredUser {
  email: string;
  nickname: string;
  image?: string;
  type: string;
  password?: string;
  phone: string;
  extra: {
    job: string;
    biography: string;
    keyword: string[];
  };
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
    typeof candidate.phone === 'string' &&
    typeof candidate.extra === 'object' &&
    candidate.extra !== null &&
    typeof (candidate.extra as Record<string, unknown>).job === 'string' &&
    typeof (candidate.extra as Record<string, unknown>).biography ===
      'string' &&
    Array.isArray((candidate.extra as Record<string, unknown>).keyword) &&
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
    return parsed.filter(isValidLocalUser).map(user => ({
      email: normalizeValue((user as LocalRegisteredUser).email),
      nickname: normalizeValue((user as LocalRegisteredUser).nickname),
      image: (user as LocalRegisteredUser).image,
      type: (user as LocalRegisteredUser).type,
      password: (user as LocalRegisteredUser).password,
      phone: (user as LocalRegisteredUser).phone,
      extra: (user as LocalRegisteredUser).extra,
      provider: (user as LocalRegisteredUser).provider,
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
          image: user.image,
          type: user.type,
          password: user.password,
          phone: user.phone,
          extra: user.extra,
          provider: user.provider,
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
    phone: user.phone,
    extra: user.extra,
    provider: user.provider,
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
  nickname?: string;
  image?: string;
  type?: string;
  phone?: string;
  extra?: {
    job?: string;
    biography?: string;
    keyword?: string[];
    [key: string]: unknown;
  };
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
    // extra 필드 구조화 (job, biography, keyword 포함)
    const extraPayload: {
      job?: string;
      biography?: string;
      keyword?: string[];
      [key: string]: unknown;
    } = {};

    if (userData.extra) {
      if (userData.extra.job) extraPayload.job = userData.extra.job;
      if (userData.extra.biography)
        extraPayload.biography = userData.extra.biography;
      if (userData.extra.keyword) extraPayload.keyword = userData.extra.keyword;
      
      // 다른 extra 필드들도 포함
      Object.keys(userData.extra).forEach(key => {
        if (!['job', 'biography', 'keyword'].includes(key)) {
          extraPayload[key] = userData.extra![key];
        }
      });
    }

    const payload: Record<string, unknown> = {
      email: userData.email,
      type: userData.type ?? 'user',
    };

    // 필수/선택 필드 추가
    if (userData.password) payload.password = userData.password;
    if (userData.name) payload.name = userData.name;
    if (userData.nickname) payload.nickname = userData.nickname;
    if (userData.image) payload.image = userData.image;
    if (userData.phone) payload.phone = userData.phone;
    if (Object.keys(extraPayload).length > 0) payload.extra = extraPayload;

    console.log('[registerUser] 회원가입 요청:', payload);
    const { data } = await api.post<ApiItemResponse<User>>('/users', payload);
    console.log('[registerUser] 회원가입 응답:', data);
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

export const getUserByPath = async (
  path: string,
): Promise<ApiItemResponse<User>> => {
  const normalizedPath = path.replace(/^\/+/, '');
  const { data } = await api.get<ApiItemResponse<User>>(
    `/users/${normalizedPath}`,
  );
  return data;
};

export const getUserByEmail = async (
  email: string,
): Promise<ApiItemResponse<User>> => {
  const normalized = normalizeValue(email);
  const { data } = await api.get<ApiItemResponse<User>>(`/users/email`, {
    params: { email: normalized },
  });
  return data;
};

export const isEmailRegisteredInDb = async (
  email: string,
): Promise<boolean> => {
  const normalized = normalizeValue(email);
  try {
    const response = await getUserByEmail(normalized);
    const user = response.data ?? response.item;
    return Boolean(user);
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 404) {
        return false;
      }
      // 서버가 409(Conflict)로 중복을 알리는 경우 → 사용 중인 이메일
      if (status === 409) {
        return true;
      }
    }
    console.error(
      '[apiClient] Failed to check server email duplication:',
      error,
    );
    throw error;
  }
};

// ✅ 닉네임으로 사용자 조회 (/users/name?name=...)
export const getUserByName = async (
  name: string,
): Promise<ApiItemResponse<User>> => {
  const normalized = normalizeValue(name);
  const { data } = await api.get<ApiItemResponse<User>>(`/users/name`, {
    params: { name: normalized },
  });
  return data;
};

// ✅ DB 닉네임 중복 여부 확인
export const isNameRegisteredInDb = async (name: string): Promise<boolean> => {
  const normalized = name.trim();
  if (!normalized) return false;
  try {
    const response = await getUserByName(normalized);
    const user = response.data ?? response.item;
    return Boolean(user);
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 404) {
        return false;
      }
    }
    console.error(
      '[apiClient] Failed to check server name duplication:',
      error,
    );
    throw error;
  }
};

// ========================================================
// ⭐ Token Store (SSR 안전 버전)
// ========================================================
export const tokenStore = {
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem('accessToken');
  },

  setAccessToken(token: string): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('accessToken', token);
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem('accessToken');
  },
};
