import { createTheme } from '@mui/material'

const theme = createTheme({
  typography: {
    // fontFamily: 'RobotoMono Nerd Font',
    subtitle1: {
      fontSize: '1.05rem',
      fontWeight: '400'
    }
  },

  palette: {
    primary: {
      main: '#2973B2',
      light: '#eef5fb',
      dark: '#051D50'
    },
    secondary: {
      main: '#00B198'
    },
    background: {
      paper: '#FFFFFF'
    },
    contrastThreshold: 3
  }
})
export default theme
