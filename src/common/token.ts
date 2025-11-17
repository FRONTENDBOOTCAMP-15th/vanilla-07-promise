// ✅ 세션 스토리지 기반 토큰 관리

export interface AuthSession {
  token: string;
  email?: string;
  name?: string;
  loggedAt?: string;
}

const SESSION_STORAGE_KEY = 'vanilla:auth:session';

/**
 * 세션 스토리지에 토큰 저장
 */
export function saveToken(
  token: string,
  email?: string,
  name?: string,
): void {
  if (typeof window === 'undefined') return;

  try {
    const session: AuthSession = {
      token,
      ...(email && { email }),
      ...(name && { name }),
      loggedAt: new Date().toISOString(),
    };
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    console.log('[token] ✅ 토큰이 세션 스토리지에 저장되었습니다:', {
      token: token.substring(0, 20) + '...',
      email,
      name,
      loggedAt: session.loggedAt,
    });
  } catch (error) {
    console.error('[token] ❌ Failed to save token to session storage:', error);
  }
}

/**
 * 세션 스토리지에서 토큰 가져오기
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      console.log('[token] ℹ️ 세션 스토리지에 토큰이 없습니다.');
      return null;
    }

    const session = JSON.parse(raw) as AuthSession;
    const token = session.token ?? null;
    if (token) {
      console.log('[token] ✅ 토큰 조회 성공:', {
        token: token.substring(0, 20) + '...',
        email: session.email,
        name: session.name,
        loggedAt: session.loggedAt,
      });
    } else {
      console.log('[token] ⚠️ 세션 데이터는 있지만 토큰이 없습니다.');
    }
    return token;
  } catch (error) {
    console.error('[token] ❌ Failed to get token from session storage:', error);
    return null;
  }
}

/**
 * 세션 스토리지에서 전체 세션 정보 가져오기
 */
export function getSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      console.log('[token] ℹ️ 세션 스토리지에 세션 정보가 없습니다.');
      return null;
    }

    const session = JSON.parse(raw) as AuthSession;
    console.log('[token] ✅ 세션 정보 조회 성공:', {
      token: session.token ? session.token.substring(0, 20) + '...' : '없음',
      email: session.email,
      name: session.name,
      loggedAt: session.loggedAt,
    });
    return session;
  } catch (error) {
    console.error('[token] ❌ Failed to get session from session storage:', error);
    return null;
  }
}

/**
 * 토큰이 있는지 확인
 */
export function hasToken(): boolean {
  const token = getToken();
  const has = token !== null;
  console.log(`[token] ${has ? '✅' : '❌'} 토큰 존재 여부:`, has);
  return has;
}

/**
 * 세션 스토리지에서 토큰 제거
 */
export function clearToken(): void {
  if (typeof window === 'undefined') return;

  try {
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    console.log('[token] ✅ 토큰이 세션 스토리지에서 제거되었습니다.');
  } catch (error) {
    console.error('[token] ❌ Failed to clear token from session storage:', error);
  }
}

/**
 * 토큰이 없으면 로그인 페이지로 리다이렉트
 * @param redirectPath 로그인 페이지 경로 (기본: '/src/features/login/login.html')
 */
export function requireAuth(redirectPath: string = '/src/features/login/login.html'): boolean {
  const token = getToken();
  const has = token !== null;
  
  if (!has) {
    console.log('[token] ⚠️ 토큰이 없어 로그인 페이지로 리다이렉트합니다:', redirectPath);
    console.log('[token] 현재 페이지:', window.location.href);
    window.location.href = redirectPath;
    return false;
  }
  
  console.log('[token] ✅ 토큰 인증 성공 - 페이지 접근 허용');
  return true;
}

// 임시 토큰 (호환성 유지)
export const TEMP_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjIwLCJ0eXBlIjoic2VsbGVyIiwibmFtZSI6IuuCmOyekeqwgCIsImVtYWlsIjoiaHl1bmpvb0BuYXZlci5jb20iLCJpbWFnZSI6Imh0dHBzOi8vcmVzLmNsb3VkaW5hcnkuY29tL2RkZWRzbHF2di9pbWFnZS91cGxvYWQvdjE3NjI3NTg2NjcvbmlrZS9sNnd0NWdRUFRkLndlYnAiLCJsb2dpblR5cGUiOiJlbWFpbCIsImlhdCI6MTc2MzI2MDU4NCwiZXhwIjoxNzYzMzQ2OTg0LCJpc3MiOiJGRUJDIn0.YPqojNXmrFqJ8WoYVL1i0Yfdn_w2LBmo8PXokXFR-kk';
