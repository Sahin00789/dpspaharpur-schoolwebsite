// src/Pages/PublicLogin.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const PublicLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signInAsPublic } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Get the redirect path from location state or search params
  const from = location.state?.from || 
              new URLSearchParams(location.search).get('from') || 
              '/';
  
  console.log('Redirecting after login to:', from);

  const handleGoogleSignIn = async () => {
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      const result = await signInAsPublic();
      if (result.success) {
        console.log('User signed in successfully, redirecting to:', from);
        toast.success('Signed in successfully!', { duration: 2000 });
        
        // Wait a moment for the toast to show before redirecting
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Ensure we don't redirect to login page
        const safePath = from === '/login' ? '/' : from;
        navigate(safePath, { replace: true });
      } else {
        throw new Error(result.error || 'Failed to sign in');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome</h1>
          <p className="text-gray-600 mb-4">
            {location.state?.message || 'Sign in to submit admission or contact us'}
          </p>
          {from !== '/' && (
            <p className="text-sm text-gray-500 mb-6">
              You'll be redirected back to the previous page after signing in.
            </p>
          )}
          
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <FcGoogle className="w-5 h-5" />
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <p className="mt-4 text-sm text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PublicLogin;