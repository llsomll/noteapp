import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  sub: string; // user ID
  exp: number;
};

export const storeTokensLocally = (token: { access_token: string; token_type: string }) => {
  if (token?.access_token) {
    localStorage.setItem("access_token", token.access_token);
    localStorage.setItem("token_type", token.token_type ?? "bearer");
  } else {
    console.warn("Invalid token response:", token);
  }
};

export const getCurrentUserId = (): string | null => {
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.sub;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
};

export const isLoggedIn = () => {
  return getCurrentUserId() !== null && !isTokenExpired();
};

export const isTokenExpired = (): boolean => {
  const token = localStorage.getItem("access_token");
  if (!token) return true;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return Date.now() / 1000 > decoded.exp;
  } catch {
    return true;
  }
};

export const clearAuth = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("token_type");
};

