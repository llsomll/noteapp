import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import NotFound from '../components/pages/NotFound';

export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/login', search: { redirect: '/_auth/dashboard' } })
    }
  },
  component: AuthLayout,
  notFoundComponent: NotFound
})

function AuthLayout() {
  return <Outlet />;
}
