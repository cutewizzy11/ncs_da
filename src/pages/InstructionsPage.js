import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Paper, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Alert,
  Divider,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { Check as CheckIcon, Warning as WarningIcon } from '@mui/icons-material';
import Webcam from 'react-webcam';
import { useAuth } from '../context/AuthContext';

const InstructionsPage = () => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [isNoiseDetected, setIsNoiseDetected] = useState(false);
  const webcamRef = React.useRef(null);
  const audioContextRef = React.useRef(null);
  const analyserRef = React.useRef(null);
  const animationFrameRef = React.useRef(null);
  const navigate = useNavigate();
  const { user, isVerified, verifyFace } = useAuth();
  
  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Set up audio monitoring
  useEffect(() => {
    const setupAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current);
        analyserRef.current.fftSize = 256;
        
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        const checkNoise = () => {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          
          if (average > 30) { // Threshold for noise detection
            setIsNoiseDetected(true);
          } else {
            setIsNoiseDetected(false);
          }
          
          animationFrameRef.current = requestAnimationFrame(checkNoise);
        };
        
        checkNoise();
      } catch (err) {
        console.error('Error setting up audio monitoring:', err);
      }
    };
    
    setupAudio();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  const handleVerifyFace = async () => {
    if (!webcamRef.current) return;
    
    const imageSrc = webcamRef.current.getScreenshot();
    const result = await verifyFace(imageSrc);
    
    if (result.success) {
      setVerificationStatus('success');
    } else {
      setVerificationStatus('error');
    }
  };

  const handleStartTest = () => {
    if (acceptedTerms && isVerified) {
      navigate('/');
    }
  };

  if (!user) return null;

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Test Instructions & Verification
        </Typography>
        
        <Box sx={{ my: 4 }}>
          <Typography variant="h6" gutterBottom>Please read the following instructions carefully:</Typography>
          
          <List dense>
            {[
              'Ensure you are in a well-lit room for proper face verification',
              'Keep your face clearly visible to the camera',
              'Remove any face coverings (except for medical or religious reasons)',
              'Ensure your entire face is within the frame',
              'Maintain a neutral expression and look directly at the camera',
              'Do not wear sunglasses or hats that obscure your face',
              'The test will be automatically submitted if excessive noise is detected',
              'You cannot pause the test once started',
              'Use of any external help or materials is strictly prohibited',
              'The test is timed, so manage your time wisely'
            ].map((instruction, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={instruction} />
              </ListItem>
            ))}
          </List>
        </Box>
        
        <Divider sx={{ my: 4 }} />
        
        <Box sx={{ my: 4 }}>
          <Typography variant="h6" gutterBottom>Face Verification</Typography>
          
          {!isVerified ? (
            <>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' }, 
                gap: 4,
                alignItems: 'center',
                mb: 3
              }}>
                <Box 
                  sx={{ 
                    width: 320, 
                    height: 240, 
                    border: '2px dashed', 
                    borderColor: 'grey.400',
                    borderRadius: 1,
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                      width: 320,
                      height: 240,
                      facingMode: 'user'
                    }}
                    onUserMedia={() => setIsCameraReady(true)}
                    style={{
                      display: 'block',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  {!isCameraReady && (
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      color: 'white'
                    }}>
                      <Typography>Initializing camera...</Typography>
                    </Box>
                  )}
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" paragraph>
                    Please ensure your face is clearly visible in the frame and click the "Verify My Identity" button below.
                  </Typography>
                  
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleVerifyFace}
                    disabled={!isCameraReady || verificationStatus === 'verifying'}
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    {verificationStatus === 'verifying' ? 'Verifying...' : 'Verify My Identity'}
                  </Button>
                  
                  {verificationStatus === 'error' && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      Verification failed. Please try again.
                    </Alert>
                  )}
                  
                  {isNoiseDetected && (
                    <Alert 
                      severity="warning" 
                      icon={<WarningIcon />}
                      sx={{ mt: 2 }}
                    >
                      High noise level detected. Please move to a quieter environment.
                    </Alert>
                  )}
                </Box>
              </Box>
            </>
          ) : (
            <Alert severity="success" sx={{ mb: 3 }}>
              Your identity has been successfully verified. You may now proceed to the test.
            </Alert>
          )}
          
          <FormControlLabel
            control={
              <Checkbox 
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                color="primary"
              />
            }
            label="I have read and agree to the test instructions and conditions."
            sx={{ mt: 2 }}
          />
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleStartTest}
              disabled={!acceptedTerms || !isVerified}
            >
              Proceed to Test
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default InstructionsPage;
