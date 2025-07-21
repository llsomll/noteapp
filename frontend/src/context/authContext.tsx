import React, { createContext, useState, useEffect } from 'react'
import {
  isLoggedIn,
  getCurrentUserId,
  clearAuth,
  setAccessToken,
  clearAccessToken
} from '../utils/auth'
import { getCurrentUser, refreshToken } from '../api/api-client'

export interface AuthContextType  {
  isAuthenticated: boolean
  userId: string | null
  login: (token: { access_token: string; token_type: string }) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(getCurrentUserId())
  const [isAuthenticated, setIsAuthenticated] = useState(isLoggedIn())

  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const res = await refreshToken(); // includes refresh_token cookie
        setAccessToken(res.access_token);
        setIsAuthenticated(true);

        const user = await getCurrentUser(); // protected route
        setUserId(user.id);
      } catch (err) {
        console.error("Token refresh failed:", err);
        setIsAuthenticated(false);
        setUserId(null);
        clearAccessToken();
      }
    };

    tryRefresh();
  }, []);

  const login = (token: { access_token: string; token_type: string }) => {
    setAccessToken(token.access_token);
    setIsAuthenticated(true)
    setUserId(getCurrentUserId())
  }

  const logout = () => {
    clearAuth()
    setIsAuthenticated(false)
    setUserId(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
