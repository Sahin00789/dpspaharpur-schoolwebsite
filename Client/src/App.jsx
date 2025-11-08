import { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layouts
import Navbar from './Layouts/Header';

// Components
import Loading from './components/Loading';

// Error boundary for lazy-loaded components
const LazyLoadErrorBoundary = ({ children }) => {
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = () => {
    setError(null);
    setRetryCount(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">
            {error.message || 'We encountered an error while loading this page.'}
          </p>
          <div className="space-y-3">
            <button 
              onClick={handleRetry}
              className="w-full px-6 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {retryCount > 0 ? 'Try Again' : 'Retry'}
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="w-full px-6 py-2.5 border border-gray-300 bg-white text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Refresh Page
            </button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 text-left text-sm text-gray-500">
              <summary className="cursor-pointer mb-2">Error Details</summary>
              <pre className="bg-gray-100 p-3 rounded-md overflow-auto text-xs">
                {error.stack || error.toString()}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  return children;
};

// Enhanced lazy loading with retry and error handling
const lazyWithRetry = (componentImport) => {
  return lazy(async () => {
    const MAX_RETRIES = 3;
    let lastError = null;
    let lastAttempt = 0;

    const safeImport = async () => {
      try {
        const module = await componentImport();
        return module;
      } catch (error) {
        throw error;
      }
    };

    const retryWithBackoff = async (attempt = 1) => {
      try {
        console.log(`[LazyLoad] Attempt ${attempt} of ${MAX_RETRIES}`);
        return await safeImport();
      } catch (error) {
        lastError = error;
        lastAttempt = attempt;
        
        if (attempt >= MAX_RETRIES) {
          throw new Error(`Failed to load component after ${MAX_RETRIES} attempts`);
        }
        
        const delay = 1000 * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        return retryWithBackoff(attempt + 1);
      }
    };
    
    return retryWithBackoff();
  });
};

// Import all components directly to avoid lazy loading issues
import HomePage from './Pages/HomePage';
import AboutUs from './Pages/staticPages/AboutUs';
import PublicNotices from './Pages/publicPages/Notices';
import Contact from './Pages/staticPages/Contact';
import Gallery from './Pages/staticPages/Gallery';
import CampusPaharpur from './Pages/staticPages/Campuses/CampusPaharpur';
import CampusMirakuri from './Pages/staticPages/Campuses/CampusMirakuri';
import CampusMadrasha from './Pages/staticPages/Campuses/CampusMadrasha';
import CampusAmrulbari from './Pages/staticPages/Campuses/CampusAmrulbari';
import Admission from './Pages/Admission';

// Admin components
import AdminLogin from './Pages/Admin/Auth/Login';
import AdminDashboard from './Pages/Admin/Dashboard';
import AdminNotices from './Pages/Admin/Notices';
import AdminPhotos from './Pages/Admin/Photos';
import AdminLayout from './layouts/AdminLayout';

// Protected route component for admin routes
const AdminRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading fullScreen />;
  }

  // Check if user is admin (email: sahin401099@gmail.com)
  const isAdmin = user?.email === 'sahin401099@gmail.com';
  const isLoginPage = location.pathname === '/admin/login';
  
  // If we're on the login page, just render the children (login form)
  if (isLoginPage) {
    return children;
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  // If authenticated and admin, render the protected content
  return children;
};

const AppContent = () => {
  const location = useLocation();
  
  return (
    <div className="App">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      }>
        {/* Show navbar for non-admin routes */}
        {!location.pathname.startsWith('/admin') && <Navbar />}
        
        <AnimatePresence mode="wait">
          <LazyLoadErrorBoundary>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/notices" element={<PublicNotices />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/admission" element={<Admission />} />
              <Route path="/campus/paharpur" element={<CampusPaharpur />} />
              <Route path="/campus/mirakuri" element={<CampusMirakuri />} />
              <Route path="/campus/madrasha" element={<CampusMadrasha />} />
              <Route path="/campus/amrulbari" element={<CampusAmrulbari />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <Outlet />
                    </AdminLayout>
                  </AdminRoute>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="notices">
                  <Route index element={<AdminNotices />} />
                  <Route path="new" element={<AdminNotices action="new" />} />
                  <Route path="edit/:id" element={<AdminNotices action="edit" />} />
                </Route>
                <Route path="photos">
                  <Route index element={<AdminPhotos />} />
                  <Route path="upload" element={<AdminPhotos action="upload" />} />
                </Route>
              </Route>
              
              {/* 404 Route */}
              <Route path="*" element={<div>Not Found</div>} />
            </Routes>
          </LazyLoadErrorBoundary>
        </AnimatePresence>
        
        <Toaster position="bottom-center" />
      </Suspense>
    </div>
  );
};

// Main App component with Providers
function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust this duration as needed

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;