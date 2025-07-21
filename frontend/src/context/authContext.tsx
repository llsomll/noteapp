import React, { createContext, useState, useEffect } from 'react'
import {
  isLoggedIn,
  getCurrentUserId,
  storeTokensLocally,
  clearAuth
} from '../utils/auth'
import { refreshToken }

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
        const res = await refreshToken(); // this sends the cookie
        setAccessToken(res.access_token);
        setIsAuthenticated(true);

        // Fetch user info (you may need to call /user/me or decode token)
        const user = await getCurrentUser();
        setUserId(user.id);
      } catch {
        setIsAuthenticated(false);
        setUserId(null);
      }
    };

    tryRefresh();
  }, []);

  const login = (token: { access_token: string; token_type: string }) => {
    storeTokensLocally(token)
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
