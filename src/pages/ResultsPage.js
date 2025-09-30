import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Grid, 
  LinearProgress, 
  Divider,
  Card,
  CardContent,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Home as HomeIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { TEST_QUESTIONS } from '../utils/testUtils';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, autoSubmitReason } = location.state || {};
  
  // Aggregate all results from localStorage
  const allResults = (() => {
    try {
      return JSON.parse(localStorage.getItem('testResults') || '[]');
    } catch {
      return [];
    }
  })();
  
  const subjectsOrder = Object.keys(TEST_QUESTIONS); // e.g., ['maths','english','current-affairs']
  const completedSubjects = new Set(allResults.map(r => r.subjectId));
  const nextSubjectId = subjectsOrder.find(id => !completedSubjects.has(id));
  
  const cumulative = allResults.reduce((acc, r) => {
    acc.totalQuestions += r.totalQuestions || 0;
    acc.correctAnswers += r.correctAnswers || 0;
    return acc;
  }, { totalQuestions: 0, correctAnswers: 0 });
  const cumulativePercentage = cumulative.totalQuestions > 0
    ? Math.round((cumulative.correctAnswers / cumulative.totalQuestions) * 100)
    : 0;
  
  // Redirect if no result data
  useEffect(() => {
    if (!result) {
      navigate('/');
    }
  }, [result, navigate]);
  
  if (!result) return null;
  
  const { 
    subject, 
    totalQuestions, 
    correctAnswers, 
    percentage, 
    timestamp,
    autoSubmitted
  } = result;
  
  const passMark = 50; // 50% pass mark
  const passed = percentage >= passMark;
  
  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Paper elevation={3} sx={{ p: 4, position: 'relative' }}>
        {autoSubmitted && (
          <Alert 
            severity="warning" 
            icon={<WarningIcon />}
            sx={{ mb: 3 }}
          >
            {autoSubmitReason || 'Your test was submitted automatically due to a violation of test conditions.'}
          </Alert>
        )}
        
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {subject} Test Results
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Test completed on {new Date(timestamp).toLocaleString()}
          </Typography>
        </Box>
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Overall Progress */}
          <Grid item xs={12}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Overall Progress
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1">Subjects Completed:</Typography>
                  <Typography fontWeight="bold">{completedSubjects.size} / {subjectsOrder.length}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Total Questions (all completed):</Typography>
                  <Typography fontWeight="bold">{cumulative.totalQuestions}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography>Correct Answers (all completed):</Typography>
                  <Typography fontWeight="bold" color="success.main">{cumulative.correctAnswers}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1">Cumulative Score:</Typography>
                  <Typography variant="h6" fontWeight="bold">{cumulativePercentage}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={cumulativePercentage} sx={{ height: 10, borderRadius: 5 }} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card 
              elevation={2} 
              sx={{ 
                height: '100%',
                borderLeft: `6px solid ${passed ? '#4caf50' : '#f44336'}`
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Test Summary
                </Typography>
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Total Questions:</Typography>
                  <Typography fontWeight="bold">{totalQuestions}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Correct Answers:</Typography>
                  <Typography fontWeight="bold" color="success.main">
                    {correctAnswers}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography>Incorrect Answers:</Typography>
                  <Typography fontWeight="bold" color="error.main">
                    {totalQuestions - correctAnswers}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1">Your Score:</Typography>
                  <Typography variant="h6" color={passed ? 'success.main' : 'error.main'} fontWeight="bold">
                    {percentage}%
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Pass Mark: {passMark}%
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color={passed ? 'success.main' : 'error.main'}
                    fontWeight="bold"
                  >
                    {passed ? 'PASSED' : 'FAILED'}
                  </Typography>
                </Box>
                
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min(percentage, 100)} 
                  color={passed ? 'success' : 'error'}
                  sx={{ 
                    height: 10, 
                    borderRadius: 5,
                    mb: 1
                  }} 
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">
                    0%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    100%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Performance Insights
                </Typography>
                <Divider sx={{ my: 2 }} />
                
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      {passed ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <CancelIcon color="error" />
                      )}
                    </ListItemIcon>
                    <ListItemText 
                      primary={passed ? 'You have passed the test!' : 'You did not pass this time.'}
                      secondary={
                        passed 
                          ? 'Congratulations on your achievement!'
                          : 'Keep practicing to improve your score.'
                      }
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <AssignmentIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Test Statistics"
                      secondary={
                        `You answered ${correctAnswers} out of ${totalQuestions} questions correctly.`
                      }
                    />
                  </ListItem>
                  
                  {!passed && (
                    <ListItem>
                      <ListItemIcon>
                        <WarningIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Areas for Improvement"
                        secondary="Review the questions you got wrong and study the related topics."
                      />
                    </ListItem>
                  )}
                </List>
                
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  {nextSubjectId ? (
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={() => navigate(`/test/${nextSubjectId}`)}
                      sx={{ mr: 2 }}
                    >
                      Take Next Subject: {TEST_QUESTIONS[nextSubjectId].title}
                    </Button>
                  ) : (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      You have completed all available subjects.
                    </Alert>
                  )}
                  <Button 
                    variant="outlined" 
                    startIcon={<HomeIcon />}
                    onClick={() => navigate('/')}
                  >
                    Back to Home
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={() => window.print()}
                  >
                    Print Results
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Next Steps
          </Typography>
          <Typography paragraph>
            {passed 
              ? 'You have successfully completed this test. Your results have been recorded. You may now proceed to take other available tests or log out.'
              : 'We encourage you to review the material and try again. You can retake this test after 24 hours.'}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
            Note: This is a computer-generated result. For any discrepancies, please contact the test administrator.
          </Typography>
        </Box>
      </Paper>
      
      {/* Print-specific styles */}
      <style jsx global>{`
        @media print {
          .MuiAppBar-root, 
          .MuiDrawer-root,
          button {
            display: none !important;
          }
          
          body {
            background: #fff !important;
          }
          
          .MuiContainer-root {
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          .MuiPaper-root {
            box-shadow: none !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </Container>
  );
};

export default ResultsPage;
