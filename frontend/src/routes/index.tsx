import { createFileRoute, useNavigate } from '@tanstack/react-router'
import DashboardPage from '../components/pages/DashboardPage'
import { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/login', search: { redirect: '/' } });
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  return <DashboardPage />
}


