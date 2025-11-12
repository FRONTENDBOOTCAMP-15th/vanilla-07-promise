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
const API_SERVER = import.meta.env.VITE_API_SERVER;

// ✅ Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_SERVER,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  userData: User
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

    const { data } = await api.post<ApiItemResponse<User>>(
      '/users/signup/oauth',
      payload
    );
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
  id: string
): Promise<ApiItemResponse<User>> => {
  const { data } = await api.get<ApiItemResponse<User>>(`/users/${id}`);
  return data;
};

// ✅ 회원 정보 수정
export const updateUser = async (
  id: string,
  updateData: Partial<User>
): Promise<ApiItemResponse<User>> => {
  const { data } = await api.put<ApiItemResponse<User>>(
    `/users/${id}`,
    updateData
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
      loginData
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
    const { data } = await api.get<ApiItemResponse<unknown>>(
      '/users/login/kakao'
    );
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
  code: string
): Promise<ApiItemResponse<User>> => {
  try {
    const { data } = await api.post<ApiItemResponse<User>>(
      '/users/login/kakao/callback',
      { code }
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
