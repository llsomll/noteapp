import { jwtDecode } from "jwt-decode"; //to decode JWTs and access their payload

type DecodedToken = {
  sub: string; // user ID
  exp: number; // Expiration time
};

// In-memory access token storage 
let accessToken: string | null = null;

// Store the access token in memory
export const setAccessToken = (token: string) => {
  accessToken = token;
};

// Retrieve the current access token from memory
export const getAccessToken = () => accessToken;

// Clear the stored access token
export const clearAccessToken = () => {
  accessToken = null;
};

// Extract the user ID from the access token
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


// Check if the current token is expired
export const isTokenExpired = (): boolean => {
   const token = accessToken;
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

