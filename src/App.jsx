import { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './hooks/useAuth.jsx';

// Layouts
import Navbar from './Layouts/Header';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './Pages/HomePage';
import Login from './Pages/Login';
import AdminDashboard from './Pages/Admin/Dashboard.jsx';
import Messages from './Pages/Admin/Messages';
import NoticesManager from './Pages/Admin/NoticesManager';
import About from './Pages/About';
import Academics from './Pages/Academics';
import Notices from './Pages/Notices';
import Contact from './Pages/Contact';
import Campuses from './Pages/Campuses';
import CampusPaharpur from './Pages/CampusPaharpur';
import CampusMirakuri from './Pages/CampusMirakuri';
import CampusMadrasha from './Pages/CampusMadrasha';
import CampusAmrulbari from './Pages/CampusAmrulbari';
import ResultsRedirect from './Pages/ResultsRedirect';
import AdmissionRedirect from './Pages/AdmissionRedirect';
import Gallery from './Pages/Gallery';
import NotFound from './Pages/NotFound';

// Styles
import './App.css';

function App() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Check if current route is admin
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        {!isAdminRoute && <Navbar />}
        
        <Toaster position="top-right" />
        <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Home and redirects */}
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          
          {/* Public routes */}
          <Route path="/about" element={<About />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/results" element={<ResultsRedirect />} />
          <Route path="/admission" element={<AdmissionRedirect />} />
          
          {/* Campus routes */}
          <Route path="/campuses" element={<Campuses />} />
          <Route path="/campuses/paharpur" element={<CampusPaharpur />} />
          <Route path="/campus/paharpur" element={<Navigate to="/campuses/paharpur" replace />} />
          <Route path="/campuses/mirakuri" element={<CampusMirakuri />} />
          <Route path="/campus/mirakuri" element={<Navigate to="/campuses/mirakuri" replace />} />
          <Route path="/campuses/madrasha" element={<CampusMadrasha />} />
          <Route path="/campus/madrasha" element={<Navigate to="/campuses/madrasha" replace />} />
          <Route path="/campuses/amrulbari" element={<CampusAmrulbari />} />
          <Route path="/campus/amrulbari" element={<Navigate to="/campuses/amrulbari" replace />} />
          
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected admin routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin" replace />} />
            <Route path="messages" element={<Messages />} />
            <Route path="notices" element={<NoticesManager />} />
          </Route>
          
          {/* Redirect old admin route */}
          <Route path="/admin-dashboard" element={<Navigate to="/admin" replace />} />
          
          {/* 404 - Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </AnimatePresence>
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1E40AF',
              color: '#fff',
              padding: '16px',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
          }}
        />
      </div>
    </AuthProvider>
  );
}

export default App;

