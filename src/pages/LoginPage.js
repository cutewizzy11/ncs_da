import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Alert
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [nin, setNin] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Basic NIN validation (11 digits)
    const ninRegex = /^\d{11}$/;
    if (!ninRegex.test(nin)) {
      setError('Please enter a valid 11-digit NIN');
      return;
    }
    
    login(nin);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          NCS CBT Login
        </Typography>
        
        <Typography variant="body1" paragraph align="center">
          Please enter your National Identification Number (NIN) to begin the test.
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            label="National Identification Number (NIN)"
            variant="outlined"
            fullWidth
            margin="normal"
            value={nin}
            onChange={(e) => setNin(e.target.value)}
            placeholder="Enter 11-digit NIN"
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*',
              maxLength: 11
            }}
            required
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2, py: 1.5 }}
          >
            Proceed to Verification
          </Button>
        </Box>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            By continuing, you agree to our test conditions and privacy policy.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
