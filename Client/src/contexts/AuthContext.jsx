import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { app } from '../firebase';

// Initialize Firebase Auth
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle email/password sign in
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      return userCredential.user;
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err.message || 'Failed to sign in');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Handle Google sign in
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      return result.user;
    } catch (err) {
      console.error('Google sign in error:', err);
      setError(err.message || 'Failed to sign in with Google');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Handle sign out
  const signOut = async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error('Sign out error:', err);
      setError(err.message || 'Failed to sign out');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Set up auth state listener
  useEffect(() => {
    let isMounted = true;
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!isMounted) return;
      
      setUser(user);
      setLoading(false);
      
      // Only handle navigation if we're not in the middle of a sign-in flow
      if (user && !location.pathname.includes('login')) {
        const isAdmin = user.email === 'sahin401099@gmail.com';
        const isAdminRoute = location.pathname.startsWith('/admin');
        
        if (isAdminRoute && !isAdmin) {
          navigate('/');
        } else if (isAdmin && location.pathname === '/admin/login') {
          // Only navigate to dashboard if we're on the login page
          navigate('/admin/dashboard', { replace: true });
        }
      } else if (!user && isAdminRoute(location.pathname) && !isLoginPage(location.pathname)) {
        navigate('/admin/login', { 
          state: { from: location.pathname },
          replace: true 
        });
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [navigate, location]);
  
  // Helper functions
  const isAdminRoute = (path) => path.startsWith('/admin');
  const isLoginPage = (path) => path === '/admin/login';

  // Export auth functions and state
  const value = {
    user,
    loading,
    error,
    signIn,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
