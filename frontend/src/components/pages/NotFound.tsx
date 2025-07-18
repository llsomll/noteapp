import { Link } from '@tanstack/react-router'
import { Box, Button, Container, Typography } from '@mui/material'

export default function NotFound() {
  return (
    <Container 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        // minHeight: '100vh',
        textAlign: 'center',
        py: 8
      }}
    >
      <Box sx={{ mb: 4, transform: 'scale(1.5)' }}>
      </Box>
      
      <Typography variant="h1" component="h1" sx={{ mt: 4, fontWeight: 'bold' }}>
        404
      </Typography>
      
      <Typography variant="h4" component="h2" sx={{ mt: 2, mb: 4 }}>
        Page Not Found
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, maxWidth: 500 }}>
        The page you are looking for might have been removed, had its name changed, 
        or is temporarily unavailable.
      </Typography>
      
      <Button 
        component={Link}
        to="/"
        variant="contained" 
        color="primary" 
        size="large"
      >
        Go to Home Page
      </Button>
    </Container>
  )
}
