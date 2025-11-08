import React from 'react';
import { Button } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { message } from 'antd';
import { useAuth } from '../../contexts/AuthContext';

const GoogleSignIn = ({ buttonText = 'Continue with Google', onSuccess, onError }) => {
  const { loginWithGoogle } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

  const handleGoogleLogin = async () => {
    try {
      // Load the Google API client library
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = () => reject(new Error('Failed to load Google API'));
        document.body.appendChild(script);
      });

      // Initialize Google Identity Services
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: 'profile email',
        callback: async (response) => {
          if (response.error) {
            const errorMessage = response.error === 'popup_closed_by_user' 
              ? 'Sign in was cancelled' 
              : 'Google sign in failed';
            message.error(errorMessage);
            onError?.(errorMessage);
            return;
          }

          try {
            // Exchange the Google auth code for a token and user info
            const { data } = await axios.post(`${API_URL}/auth/google`, {
              token: response.credential
            });

            // Call the loginWithGoogle function from AuthContext
            await loginWithGoogle(data.token, data.user);
            
            // Call the onSuccess callback if provided
            onSuccess?.(data.user);
          } catch (error) {
            console.error('Google auth error:', error);
            const errorMessage = error.response?.data?.message || 'Authentication failed';
            message.error(errorMessage);
            onError?.(errorMessage);
          }
        },
      });

      // Request the token
      client.requestAccessToken();
    } catch (error) {
      console.error('Error loading Google API:', error);
      message.error('Failed to load Google sign-in');
      onError?.('Failed to load Google sign-in');
    }
  };

  return (
    <Button 
      type="default" 
      icon={<GoogleOutlined />} 
      onClick={handleGoogleLogin}
      style={{ width: '100%', margin: '10px 0' }}
    >
      {buttonText}
    </Button>
  );
};

export default GoogleSignIn;
