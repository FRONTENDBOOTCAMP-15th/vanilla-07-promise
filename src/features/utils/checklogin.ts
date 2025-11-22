export function isUserLoggedIn(): boolean {
  return !!sessionStorage.getItem('accessToken');
}
