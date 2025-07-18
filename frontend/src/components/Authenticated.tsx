import  { useAuth } from '../hooks/useAuth'

export const Authenticated = ({
  children,
  fallback = null
}: {
  children: React.ReactNode // protected content
  fallback?: React.ReactNode //  if the user is NOT authenticated (<Navigate to="/login" /> or <LoginButton />)
}) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <>{fallback}</>
}