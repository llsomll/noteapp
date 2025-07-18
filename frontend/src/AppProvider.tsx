// import React, { useEffect } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
// import { QueryClientProvider } from '@tanstack/react-query'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/en'
import { LocalizationProvider } from '@mui/x-date-pickers'
import DrawerContext from './context/drawerContext'
import theme from './theme'

interface AppProps {
  children: React.ReactNode
}

export default function AppProvider({ children }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      {/* <QueryClientProvider client={queryClient}> */}
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
        <CssBaseline />
        <DrawerContext.Provider value={240}>{children}</DrawerContext.Provider>
      </LocalizationProvider>
      {/* </QueryClientProvider> */}
    </ThemeProvider>
  )
}
