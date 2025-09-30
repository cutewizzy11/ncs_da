import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('ncs_cbt_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  // Check if user is verified
  useEffect(() => {
    const verified = localStorage.getItem('ncs_cbt_verified') === 'true';
    setIsVerified(verified);
  }, []);

  const login = (nin) => {
    const newUser = { nin, timestamp: new Date().toISOString() };
    setUser(newUser);
    localStorage.setItem('ncs_cbt_user', JSON.stringify(newUser));
    navigate('/instructions');
  };

  const verifyFace = async (imageData) => {
    setIsVerifying(true);
    try {
      // In a real app, you would send the image to your backend for verification
      // For now, we'll simulate a successful verification after a short delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsVerified(true);
      localStorage.setItem('ncs_cbt_verified', 'true');
      return { success: true };
    } catch (error) {
      console.error('Face verification failed:', error);
      return { success: false, error: 'Face verification failed. Please try again.' };
    } finally {
      setIsVerifying(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsVerified(false);
    localStorage.removeItem('ncs_cbt_user');
    localStorage.removeItem('ncs_cbt_verified');
    navigate('/');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isVerifying, 
        isVerified, 
        login, 
        verifyFace, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
