import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import ResponsiveAppBar from '../components/ResponsiveAppBar'
import { Box } from '@mui/material'
import NotFound from '../components/pages/NotFound'
import type { AuthContextType } from '../context/authContext'

interface MyRouterContext {
  auth: AuthContextType
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
  notFoundComponent: NotFound
})


function RootComponent() {
  return (
    <>
      <ResponsiveAppBar />
      <Box sx={{ p: 2 }}>
        <Outlet />
      </Box>
    </>
  )
}
