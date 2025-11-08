import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle, onAuthStateChange } from '../../../firebase';
import { getAuth } from 'firebase/auth';

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        // Check if user's email is the specific admin email
        if (user.email === 'sahin401099@gmail.com') {
          navigate('/admin/dashboard');
        } else {
          // Sign out non-admin users
          getAuth().signOut();
          setError('Access denied. Only authorized administrators can access this portal.');
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { user } = await signInWithGoogle();
      
      // Check if the user's email is the specific admin email
      if (user && user.email === 'sahin401099@gmail.com') {
        navigate('/admin/dashboard');
      } else {
        // Sign out non-admin users
        await getAuth().signOut();
        setError('Access denied. Only authorized administrators can access this portal.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 20.477 5.754 20 7.5 20s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 20.477 18.247 20 16.5 20c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        </div>
        <h2 className="mt-2 text-3xl font-bold text-gray-900">
          School Portal
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Sign in with your school Google account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Sign in with Google
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                aria-label="Sign in with Google"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" viewBox="0 0 24 24">
                      <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                        <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.28426 53.749 C -8.52426 55.059 -9.12426 56.159 -10.0243 56.959 L -10.0243 60.179 L -5.50426 60.179 C -3.12426 57.969 -3.264 53.999 -3.264 51.509 Z"/>
                        <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.80426 62.159 -6.82426 60.179 L -10.0243 56.959 C -11.1543 57.969 -12.764 58.489 -14.754 58.489 C -17.564 58.489 -20.0643 56.699 -20.8343 54.079 L -25.4643 54.079 L -25.4643 57.329 C -23.3743 61.419 -19.3843 63.239 -14.754 63.239 Z"/>
                        <path fill="#FBBC05" d="M -20.8343 54.079 C -21.2243 52.809 -21.4443 51.469 -21.4443 50.089 C -21.4443 48.709 -21.2243 47.369 -20.8043 46.099 L -20.8043 42.849 L -25.4643 42.849 C -26.9243 45.769 -27.754 49.049 -27.754 52.329 C -27.754 55.609 -26.8943 58.889 -25.4343 61.809 L -20.8043 58.559 C -21.2243 57.289 -21.4443 55.949 -21.4443 54.569 C -21.4443 53.199 -21.2243 51.859 -20.8343 50.589 L -20.8343 54.079 Z"/>
                        <path fill="#EA4335" d="M -14.754 41.689 C -12.2843 41.689 -10.1243 42.589 -8.40426 44.309 L -6.34426 42.249 C -8.66426 39.999 -11.8743 38.939 -14.754 38.939 C -19.3843 38.939 -23.3743 40.759 -25.4343 44.849 L -20.8043 48.099 C -20.0243 45.479 -17.5343 43.689 -14.754 43.689 C -12.5343 43.689 -10.6343 44.909 -9.63426 46.789 L -4.98426 46.789 C -6.50426 42.859 -10.3243 41.689 -14.754 41.689 Z"/>
                      </g>
                    </svg>
                    <span className="truncate">Sign in with Google</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 text-center text-sm text-gray-600">
              <p>
                By signing in, you agree to our{' '}
                <a
                  href="/terms"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href="/privacy"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
