import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import TestPage from './pages/TestPage';
import InstructionsPage from './pages/InstructionsPage';
import ResultsPage from './pages/ResultsPage';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e', // Dark blue
    },
    secondary: {
      main: '#d32f2f', // Red
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/instructions" element={<InstructionsPage />} />
            <Route path="/test/:subject" element={<TestPage />} />
            <Route path="/results" element={<ResultsPage />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
