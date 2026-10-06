const TOKEN_KEY = "revisual_token";
const USER_KEY = "revisual_user";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "USER";
}

export const saveAuth = (
  token: string,
  user: AuthUser,
) => {
  localStorage.setItem(TOKEN_KEY, token);

  localStorage.setItem(
    USER_KEY,
    JSON.stringify(user),
  );
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getUser = (): AuthUser | null => {
  const user = localStorage.getItem(USER_KEY);

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user) as AuthUser;
  } catch {
    return null;
  }
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => {
  return Boolean(getToken());
};

/**
 * Mengambil waktu expiry JWT dalam milliseconds.
 *
 * Ini hanya untuk kebutuhan frontend UX.
 * Validasi JWT sebenarnya tetap dilakukan oleh backend.
 */
export const getTokenExpiration = (): number | null => {
  const token = getToken();

  if (!token) {
    return null;
  }

  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    const normalizedPayload = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const decodedPayload = JSON.parse(
      atob(normalizedPayload),
    ) as {
      exp?: number;
    };

    if (!decodedPayload.exp) {
      return null;
    }

    return decodedPayload.exp * 1000;
  } catch {
    return null;
  }
};

export const isTokenExpired = () => {
  const expiration = getTokenExpiration();

  if (!expiration) {
    return false;
  }

  return Date.now() >= expiration;
};