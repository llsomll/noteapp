import React from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Button, Box, Typography, Stack, useTheme, TextField, Link, useMediaQuery } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useRegisterUser } from '../../../api/api-client/auth'
import ApiCallSnackBar from '../../../components/ApiCallSnackBar'

type RegisterValues = {
  firstName: string
  lastName: string
  email: string
  password: string
}

type ValidationErrorItem = {
  msg: string
}

type ApiError = {
  detail?: string
}

const schema: yup.ObjectSchema<RegisterValues> = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Email is invalid').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must include an uppercase letter')
    .matches(/[a-z]/, 'Must include a lowercase letter')
    .matches(/\d/, 'Must include a number')
    .matches(/[@$!%*?&]/, 'Must include a special character')
    .required('Password is required')
})

export const Route = createFileRoute('/(login)/_loginLayout/register')({
  component: RegisterComponent
})

function RegisterComponent() {
  const router = useRouter()
  const { palette } = useTheme()
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))
  const [openSnackbar, setOpenSnackbar] = React.useState(false)

  const { control, handleSubmit, formState } = useForm<RegisterValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    },
    resolver: yupResolver(schema)
  })

  const { errors } = formState

  const createUser = useRegisterUser({
    mutation: {
      onSuccess: () => {
        setOpenSnackbar(true)
        setTimeout(() => {
          router.navigate({ to: '/login', search: { redirect: '' } })
        }, 1000)
      }
    }
  })

  const onSubmit = (data: RegisterValues) => {
    const { firstName, lastName, email, password } = data

    // Convert to backend shape
    const payload = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    }

    createUser.mutate({ data: payload })
  }

  return (
    <Stack direction="row" spacing={4} justifyContent="center">
      <Box flex={1}>
        <Box sx={{ p: 4, width: '100%' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="First Name"
                  variant="standard"
                  fullWidth
                  margin="normal"
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />
              )}
            />
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Last Name"
                  variant="standard"
                  fullWidth
                  margin="normal"
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  variant="standard"
                  fullWidth
                  margin="normal"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Password"
                  type="password"
                  variant="standard"
                  fullWidth
                  margin="normal"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              )}
            />

            <Box my={2}>
              <Button type="submit" color="primary" variant="contained" fullWidth>
                Register
              </Button>
            </Box>
          </form>

          <Box textAlign="center">
            <Link href="/login">Already have an account? Sign in</Link>
          </Box>
        </Box>
      </Box>

      {/* About section (reuse from login) */}
      {!isSmallScreen && (
        <Box flex={1} sx={{ textAlign: 'left' }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            sx={{
              borderBlockEnd: `solid 2px ${palette.primary.main}`,
              writingMode: 'horizontal-tb',
              paddingBottom: '4px',
              color: palette.primary.main
            }}
          >
            About
          </Typography>
          <Typography variant="body1">Welcome to My Note! Create your account to start organizing your notes, tasks, and ideas all in one place.</Typography>
        </Box>
      )}

      {createUser.status !== 'idle' && (
        <ApiCallSnackBar
          open={openSnackbar}
          setOpen={setOpenSnackbar}
          isSuccess={createUser.isSuccess}
          success="User registered successfully"
          error={
            Array.isArray(createUser.error)
              ? (createUser.error as ValidationErrorItem[]).map((e) => e.msg).join(', ')
              : (createUser.error as ApiError)?.detail ?? 'Something went wrong'
          }
        />
      )}
    </Stack>
  )
}

export default RegisterComponent
