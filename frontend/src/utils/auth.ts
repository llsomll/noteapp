import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  sub: string; // user ID
  exp: number;
};

// In-memory access token storage 
let accessToken: string | null = null;

export const setAccessToken = (token: string) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
  accessToken = null;
};

export const getCurrentUserId = (): string | null => {
  if (!accessToken) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(accessToken);
    return decoded.sub;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
};



export const isTokenExpired = (): boolean => {
   const token = accessToken || localStorage.getItem("access_token");
  if (!token) return true;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return Date.now() / 1000 > decoded.exp;
  } catch {
    return true;
  }
};


export const isLoggedIn = () => {
  return getCurrentUserId() !== null && !isTokenExpired();
};


export const clearAuth = () => {
  clearAccessToken();
};

