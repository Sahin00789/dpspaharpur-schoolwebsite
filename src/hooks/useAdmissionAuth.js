import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getApplicationByUserId } from '../services/admissionService';
import { toast } from 'react-hot-toast';

export const useAdmissionAuth = () => {
  const { user, loading: authLoading, signInAsPublic } = useAuth();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch application data
  const fetchApplication = useCallback(async () => {
    if (!user?.uid) return null;
    
    try {
      setLoading(true);
      const appData = await getApplicationByUserId(user.uid);
      if (appData) {
        setApplication(appData);
        return appData;
      }
      return null;
    } catch (err) {
      console.error('Error fetching application:', err);
      const errorMsg = 'Failed to load application. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Check for existing application when user changes
  useEffect(() => {
    if (user) {
      fetchApplication();
    } else {
      setApplication(null);
      setLoading(false);
    }
  }, [user, fetchApplication]);

  // Handle Google sign-in for admission
  const handleSignIn = async () => {
    try {
      const result = await signInAsPublic();
      if (!result.success) {
        throw new Error(result.error || 'Failed to sign in');
      }
      return result.user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  return {
    user,
    application,
    loading: authLoading || loading,
    error,
    isAuthenticated: !!user,
    hasApplication: !!application,
    handleSignIn,
    refreshApplication: fetchApplication
  };
};
