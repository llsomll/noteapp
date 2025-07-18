// src/components/ProfilePage.tsx

import { Box, Typography, useTheme } from '@mui/material'
import { useGetCurrentUser } from '../../api/api-client/user'

export default function ProfilePage() {
  const { palette } = useTheme()
  const {
    data: user,
    isLoading,
    isError,
  } = useGetCurrentUser()

  if (isLoading) return <Typography>Loading profile...</Typography>
  if (isError || !user) return <Typography>Error loading profile.</Typography>

  return (
    <Box flex={1} p={3} sx={{ textAlign: 'left' }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{
          borderBlockEnd: `solid 2px ${palette.primary.main}`,
          writingMode: 'horizontal-tb',
          paddingBottom: '4px',
          marginBottom: '20px',
          color: palette.primary.main
        }}
      >
        Profile
      </Typography>
      <Typography variant="body1">
        <strong>First Name: </strong> {user.first_name}
      </Typography>
      <Typography variant="body1">
        <strong>Last Name: </strong> {user.last_name}
      </Typography>
      <Typography variant="body1">
        <strong>Email: </strong> {user.email}
      </Typography>
      <Typography variant="body1">
        <strong>Joined: </strong> {new Date(user.created_at).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })}
      </Typography>
    </Box>
  )
}
