import { useState, useEffect, useCallback, useContext, createContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  onAuthStateChange, 
  signInWithGoogle, 
  logOut,
  signInWithEmailAndPassword,
  auth,
  getCurrentUser
} from '../utils/auth';

// Create auth context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle user authentication state changes
  useEffect(() => {
    const handleAuthStateChange = async (authState) => {
      try {
        if (authState?.user) {
          // User is signed in
          const { user: authUser, isAdmin } = authState;
          
          setUser({
            uid: authUser.uid,
            email: authUser.email,
            displayName: authUser.displayName,
            photoURL: authUser.photoURL,
            isAdmin
          });
          
          setIsAdmin(isAdmin);
          
          // Redirect to the protected route they were trying to access, or home
          const redirectTo = location.state?.from?.pathname || '/';
          if (location.pathname === '/login') {
            navigate(redirectTo, { replace: true });
          }
        } else {
          // User is signed out
          setUser(null);
          setIsAdmin(false);
          
          // If we're on a protected route, redirect to login
          if (location.pathname.startsWith('/admin')) {
            navigate('/login', { state: { from: location }, replace: true });
          }
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setUser(null);
        setIsAdmin(false);
        
        if (location.pathname.startsWith('/admin')) {
          navigate('/login', { state: { from: location }, replace: true });
        }
      } finally {
        setLoading(false);
      }
    };
    
    const unsubscribe = onAuthStateChange(handleAuthStateChange);
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [navigate, location]);

  // Sign in with Google
  const handleGoogleSignIn = useCallback(async () => {
    setLoading(true);
    
    try {
      await signInWithGoogle();
      // The auth state change will handle the rest
      return { success: true };
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign out
  const handleSignOut = useCallback(async () => {
    try {
      setLoading(true);
      await logOut();
      // The auth state change will handle the navigation
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error(error.message || 'Failed to sign out');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Sign in with email and password
  const handleEmailSignIn = useCallback(async (email, password) => {
    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(email, password);
      // The auth state change will handle the rest
      return { success: true };
    } catch (error) {
      console.error('Email sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    isAuthenticated: !!user,
    isAdmin,
    user,
    loading,
    error,
    signInWithGoogle: handleGoogleSignIn,
    signOut: handleSignOut,
    signInWithEmailAndPassword: handleEmailSignIn,
    getCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Export the useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
