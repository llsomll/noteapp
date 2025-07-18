import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Box, Paper, useMediaQuery, useTheme } from '@mui/material'
import NotFound from '../../components/pages/NotFound'


export const Route = createFileRoute('/(login)/_loginLayout')({
  component: LayoutComponent,
  notFoundComponent: NotFound
})

function LayoutComponent() {

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="90vw"
      height="90vh"
    >
      {isSmallScreen ? (
        <Outlet />
      ) : (
        <Paper sx={{ p: 4, width: '80%', maxWidth: 900 }}>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Outlet />
          </Box>
        </Paper>
      )}
    </Box>
  )
}
