const TOKEN_KEY = "onetask_token";
const USER_KEY = "onetask_user";

export interface AuthUser {
  username: string;
  is_master: boolean;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuth(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  // 미들웨어용 쿠키 설정 (30일)
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `onetask_token=${token}; expires=${expires}; path=/; SameSite=Lax`;
  document.cookie = `onetask_is_master=${user.is_master}; expires=${expires}; path=/; SameSite=Lax`;
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = "onetask_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "onetask_is_master=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export function isLoggedIn(): boolean {
  return !!getToken();
}
