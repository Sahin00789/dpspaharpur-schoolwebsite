import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FiArrowLeft, FiLoader } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from "../../contexts/AuthContext";
import { toast } from 'react-hot-toast';
import { auth } from '../../firebase';

const AdminLogin = () => {
  const { signInAsAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Force token refresh to ensure we have the latest claims
          await user.getIdToken(true);
          toast.success('Already signed in');
          navigate(from, { replace: true });
        } catch (error) {
          console.error('Auth state error:', error);
          await auth.signOut();
        }
      }
    });

    return () => unsubscribe();
  }, [from, navigate]);

  const handleGoogleSignIn = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    toast.dismiss(); // Clear any existing toasts
    
    try {
      toast.loading('Opening Google Sign-In...');
      const result = await signInAsAdmin();
      
      if (result.success) {
        toast.dismiss();
        toast.success('Successfully signed in as admin');
        navigate(from, { replace: true });
      } else {
        throw new Error(result.error || 'Failed to sign in as admin');
      }
    } catch (error) {
      console.error('Admin sign-in error:', error);
      
      // Handle specific error cases
      let errorMessage = error.message || 'Failed to sign in as admin';
      
      // Map error codes to user-friendly messages
      const errorMessages = {
        'auth/account-exists-with-different-credential': 'An account already exists with the same email but different sign-in method.',
        'auth/popup-closed-by-user': 'Sign-in popup was closed before completing sign in.',
        'auth/cancelled-popup-request': 'Only one sign-in request can be made at a time.',
        'admin/access-denied': 'Access denied. Admin privileges required.',
        'auth/popup-blocked': 'Sign-in popup was blocked. Please allow popups for this site and try again.'
      };
      
      errorMessage = errorMessages[error.code] || errorMessage;
      
      toast.dismiss();
      toast.error(errorMessage);
      
      // If access is denied, redirect to home page
      if (error.code === 'admin/access-denied' || error.message.includes('Access denied')) {
        console.log('Access denied for non-admin user');
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 relative">
        <Link 
          to="/" 
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 transition-colors"
          title="Back to Home"
        >
          <FiArrowLeft className="w-5 h-5" />
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Portal</h1>
          <p className="text-gray-600 mb-8">Sign in with your admin account</p>
          
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <FiLoader className="w-5 h-5 animate-spin text-blue-600" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <FcGoogle className="w-5 h-5" />
                <span>Sign in with Google</span>
              </>
            )}
          </button>

          <p className="mt-4 text-sm text-gray-500">
            Only authorized administrators can access this portal
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
