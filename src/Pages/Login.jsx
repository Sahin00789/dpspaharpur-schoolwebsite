import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.jsx';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [error, setError] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { signInWithGoogle, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleGoogleSignIn = async () => {
    if (isSigningIn) return;
    
    setError('');
    setIsSigningIn(true);
    
    try {
      await signInWithGoogle();
      // No need to handle navigation here as the auth state change will trigger it
    } catch (err) {
      console.error('Google sign in error:', err);
      const errorMessage = err.message || 'An unexpected error occurred during sign in';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSigningIn(false);
    }
  };

  const isLoading = authLoading || isSigningIn;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Portal</h1>
            <p className="text-gray-600">Sign in with your school Google account</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 overflow-hidden"
            >
              <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            </motion.div>
          )}

          <div className="mt-8">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className={`w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${
                isLoading 
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <FcGoogle className="h-5 w-5 mr-2" />
                  Sign in with Google
                </>
              )}
            </motion.button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Don't have access?{' '}
              <a 
                href="mailto:admin@school.edu?subject=Request%20Admin%20Access" 
                className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact Administrator
              </a>
            </p>
          </div>
        </motion.div>
      </div>
      
      <div className="text-center text-xs text-gray-500 max-w-md px-4">
        <p>By signing in, you agree to our Terms of Service and Privacy Policy.</p>
      </div>
    </div>
  );
};

export default Login;
