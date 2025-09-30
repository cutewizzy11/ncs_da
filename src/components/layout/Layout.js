import React from 'react';
import { Box, Container, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
            NCS CBT System
          </Typography>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" color="inherit">
                NIN: {user.nin}
              </Typography>
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        {children}
      </Container>
      <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: (theme) => theme.palette.grey[200] }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Nigeria Customs Service - CBT System
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
