import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Grid,
  Card,
  CardContent,
  CardActions,
  Alert
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, isVerified } = useAuth();

  const handleStartTest = (subject) => {
    if (!isVerified) {
      navigate('/login');
    } else {
      navigate(`/test/${subject}`);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Nigeria Customs Service
        </Typography>
        <Typography variant="h5" color="primary" gutterBottom>
          Computer Based Test (CBT) Portal
        </Typography>
        
        {!user ? (
          <Paper elevation={3} sx={{ p: 4, mt: 4, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Welcome to NCS CBT System
            </Typography>
            <Typography paragraph>
              Please log in with your NIN to begin your test. You will need to complete 
              a quick face verification before starting the test.
            </Typography>
            <Button 
              variant="contained" 
              size="large" 
              onClick={() => navigate('/login')}
              sx={{ mt: 2 }}
            >
              Login to Start Test
            </Button>
          </Paper>
        ) : (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Welcome, Candidate
            </Typography>
            <Typography paragraph>
              Please select a subject to begin your test.
            </Typography>
            
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {[
                { id: 'maths', name: 'Mathematics', description: '20 questions, 30 minutes' },
                { id: 'english', name: 'English Language', description: '20 questions, 25 minutes' },
                { id: 'current-affairs', name: 'Current Affairs', description: '20 questions, 20 minutes' }
              ].map((subject) => (
                <Grid item xs={12} md={4} key={subject.id}>
                  <Card elevation={3}>
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {subject.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                        {subject.description}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                      <Button 
                        size="small" 
                        variant="contained"
                        onClick={() => handleStartTest(subject.id)}
                        disabled={!isVerified}
                      >
                        Start Test
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            {!isVerified && (
              <Alert severity="info" sx={{ mt: 3, maxWidth: 600, mx: 'auto' }}>
                Please complete the face verification process to unlock the tests.
              </Alert>
            )}
          </Box>
        )}
        
        <Paper elevation={2} sx={{ p: 3, mt: 6, textAlign: 'left' }}>
          <Typography variant="h6" gutterBottom>Test Instructions:</Typography>
          <ul>
            <li>Ensure you have a stable internet connection</li>
            <li>Use a device with a working webcam and microphone</li>
            <li>Complete the test in a quiet environment</li>
            <li>You cannot pause once the test has started</li>
            <li>Each test has a time limit</li>
            <li>Results will be displayed immediately after submission</li>
          </ul>
        </Paper>
      </Box>
    </Container>
  );
};

export default HomePage;
