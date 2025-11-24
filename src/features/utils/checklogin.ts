export function isUserLoggedIn(): boolean {
  return !!getToken();
}

export function getToken(): string | null {
  const localToken = localStorage.getItem('accessToken');
  if (localToken) return localToken;

  return sessionStorage.getItem('accessToken');
}

export function getUserInform() {
  const userData =
    localStorage.getItem('user') ?? sessionStorage.getItem('user');
  if (!userData) return null;

  try {
    return JSON.parse(userData);
  } catch {
    console.warn('user 데이터 파싱 실패');
    return null;
  }
}