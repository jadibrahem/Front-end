import React, { useState } from 'react';
import log from '../components/log.js';

import { Container, TextField, Button, Typography, Paper, Box } from '@mui/material';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await log.login(username, password);
      if (user) {
        // If login is successful, refresh the page to reflect the new auth state
        window.location.reload();
        window.location = '/dash';
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Container 
    component="main" 
    maxWidth="xs"
    style={{
      backgroundImage: 'url(/logohalo.png)',
      backgroundSize: 'contain', // or 'cover' depending on your preference
      backgroundPosition: 'center', // Adjust this as needed
      backgroundRepeat: 'no-repeat',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative', // For overlay positioning
    }}
  >
    <Paper elevation={6} sx={{ 
      padding: 3, 
      position: 'relative', // Needed to stack above the overlay
      backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background

      boxShadow: '0 4px 6px rgba(0,0,0,0.1)', // Soft shadow around the form
      borderRadius: '4px', // Optional rounded corners
      zIndex: 1, // Ensures the form is above the background image
    }}>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;