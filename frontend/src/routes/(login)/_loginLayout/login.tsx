import React, { useEffect } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Button, Box, Link, Typography, Stack, useTheme, TextField, useMediaQuery } from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { useLogin } from '../../../api/api-client/auth'
import { useAuth } from '../../../hooks/useAuth'

type LoginSearch = {
  redirect: string
}

type TokenResponse = {
  access_token: string
  token_type: string
}

type ErrorWithDetail = {
  detail?: string
}

// Define the route
export const Route = createFileRoute('/(login)/_loginLayout/login')({
  component: LoginComponent,
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    return {
      redirect: (search.redirect as string) || '/'
    }
  }
})

// Define the form values
type FormValues = {
  email: string
  password: string
}

// Validation schema with Yup
const schema: yup.ObjectSchema<FormValues> = yup.object({
  email: yup.string().email('Email format is not valid').required('Email is required'),
  password: yup.string().required('Password is required')
})

function LoginComponent() {
  const router = useRouter()
  const { palette } = useTheme()
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))
  const { login, isAuthenticated } = useAuth()
  

  useEffect(() => {
    if (isAuthenticated) {
      router.navigate({ to: '/' })
    }
  }, [isAuthenticated])

  // Setup react-hook-form
  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: yupResolver(schema)
  })

  const { errors } = formState

  // Mutation for login
  const loginMutation = useLogin()

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    loginMutation.mutate(
      {
        data: {
          username: data.email,
          password: data.password,
          grant_type: 'password'
        }
      },
      {
        onSuccess: token => {
          // Defensive check for token shape
          const accessToken = (token as TokenResponse).access_token
          const tokenType = (token as TokenResponse).token_type

          if (accessToken && tokenType) {
            login({ access_token: accessToken, token_type: tokenType })
            console.log('Successful Login')
            const redirectTo = router.state.location.search.redirect || '/'
            router.navigate({ to: redirectTo })
          } else {
            console.error('Unexpected token format:', token)
          }
        },
        onError: error => {
          console.error('Login failed:', error)
        }
      }
    )
  }

  return (
    <Stack direction="row" spacing={4} justifyContent="center">
      <Box flex={1} >
        <Box sx={{ p: 3, width: '100%' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
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

            {/* Password Field */}
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

            {/* Error message if login fails */}
            {loginMutation.isError && loginMutation.error && (
              <Typography variant="body2" color="error" sx={{ textAlign: 'center', mt: 1 }}>
                {(loginMutation.error as ErrorWithDetail)?.detail || 'Invalid email or password.'}
              </Typography>
            )}

            {/* Submit Button */}
            <Box my={2}>
              <Button type="submit" color="primary" variant="contained" fullWidth>
                Sign in
              </Button>
            </Box>
          </form>

          {/* Links for Forgot Password and Register */}
          <Box textAlign="center">
            {/* <Link href="/forgot-password">Forgot password?</Link>
            <br /> */}
            <Link href="/register">Create Account</Link>
          </Box>
        </Box>
      </Box>

      {/* About Section */}
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
              borderRadius: '0px',
              color: `${palette.primary.main}`
            }}
          >
            About
          </Typography>
          <Typography variant="body1">Welcome to My Note! Keep all your notes, ideas, and tasks in one place.</Typography>
          <Typography variant="body1">Sign in to access your notes from any device, stay organized, and never forget an idea again.</Typography>
        </Box>
      )}
    </Stack>
  )
}
