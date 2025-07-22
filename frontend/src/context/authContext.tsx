import React, { createContext, useState, useEffect } from 'react'
import {
  isLoggedIn,
  getCurrentUserId,
  setAccessToken,
  clearAccessToken
} from '../utils/auth'
import { getCurrentUser, refreshToken, useLogout } from '../api/api-client'

export interface AuthContextType {
  isAuthenticated: boolean
  userId: string | null
  login: (token: { access_token: string; token_type: string }) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(getCurrentUserId())
  const [isAuthenticated, setIsAuthenticated] = useState(isLoggedIn())
  const [loading, setLoading] = useState(true)

  // Try to refresh access token when the app loads
  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const res = await refreshToken(); // Refresh token from cookie
        setAccessToken(res.access_token); // Store new access token
        setIsAuthenticated(true); // Mark user as authenticated

        try {
          const user = await getCurrentUser(); // Call this only after refresh worked
          setUserId(user.id);
        } catch (userErr) {
          console.error("Fetching user after refresh failed:", userErr);
          setUserId(null);
        }
      } catch (err) {
        console.error("Token refresh failed:", err);
        // If refresh fails, clear everything
        setIsAuthenticated(false);
        setUserId(null);
        clearAccessToken();
      } finally {
        setLoading(false)
      }
    };

    tryRefresh();
  }, []);


  const handleLogout = () => {
    clearAccessToken();
    setIsAuthenticated(false);
    setUserId(null);
    window.location.href = '/login';
  };


  const { mutate: logoutMutation } = useLogout({
    mutation: {
      onSuccess: handleLogout,
      onError: (error) => {
        console.error("Logout failed:", error)
        handleLogout();
      }
    }
  })


  const login = (token: { access_token: string; token_type: string }) => {
    setAccessToken(token.access_token);
    setIsAuthenticated(true) // Mark as logged in
    setUserId(getCurrentUserId())
  }

  const logout = () => {
    logoutMutation()
  }

  if (loading) return null;

  // Provide the auth context to all children
  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
