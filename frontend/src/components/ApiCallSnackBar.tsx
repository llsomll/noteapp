import { Snackbar, Alert } from '@mui/material'
import type { SnackbarCloseReason } from '@mui/material'

export type ApiCallSnackBarProps = {
  open: boolean
  setOpen: (value: boolean) => void
  isSuccess: boolean
  error?: string | string[] | null
  success?: string
}

export default function ApiCallSnackBar({
  open,
  setOpen,
  isSuccess,
  error,
  success = 'Project Saved Successfully'
}: ApiCallSnackBarProps) {
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }
  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      autoHideDuration={6000}
      onClose={handleClose}>
      <Alert onClose={handleClose} variant="filled" severity={isSuccess ? 'success' : 'error'} sx={{ width: '100%' }}>
        {isSuccess ? success : error}
      </Alert>
    </Snackbar>
  )
}
