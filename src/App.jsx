import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { QueryClientProvider } from './providers/QueryClientProvider';

// Layouts
import Navbar from './Layouts/Header';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './Pages/HomePage';
import PublicLogin from './Pages/PublicLogin';
import AdminRoutes from './routes/AdminRoutes';
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
import Admission from './Pages/Admission';
import ApplyForm from './Pages/Admission/ApplyForm';
import EditForm from './Pages/Admission/EditForm';
import ApplicationPrint from './Pages/Admission/components/ApplicationPrint';
import AdmissionTestAdmit from './Pages/Admission/components/AdmissionTestAdmit';
import Gallery from './Pages/Gallery';
import NotFound from './Pages/NotFound';
import AdminLogin from './Pages/Admin/AdminLogin';
import Loading from './components/Loading';

// Styles
import './App.css';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading time or wait for necessary data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust time as needed

    return () => clearTimeout(timer);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AuthProvider>
      <QueryClientProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          {!isAdminRoute && <Navbar />}
          
          <main className="flex-grow pt-0 pb-16">
            <AnimatePresence mode="wait">
              <Routes key={location.pathname} location={location}>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<About />} />
                <Route path="/academics" element={<Academics />} />
                <Route path="/notices" element={<Notices />} />
                <Route path="/campuses" element={<Campuses />} />
                <Route path="/campus/paharpur" element={<CampusPaharpur />} />
                <Route path="/campus/mirakuri" element={<CampusMirakuri />} />
                <Route path="/campus/madrasha" element={<CampusMadrasha />} />
                <Route path="/campus/amrulbari" element={<CampusAmrulbari />} />
                <Route path="/results" element={<ResultsRedirect />} />
                <Route path="/gallery" element={<Gallery />} />
                
                {/* Public routes accessible to all authenticated users */}
                <Route 
                  path="/contact" 
                  element={
                    <ProtectedRoute requireAuth={true}>
                      <Contact />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admission/apply/new" 
                  element={
                    <ProtectedRoute requireAuth={true}>
                      <ApplyForm />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admission/application/edit/:id" 
                  element={
                    <ProtectedRoute requireAuth={true}>
                      <EditForm />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admission/application/print/:applicationId" 
                  element={
                    <ProtectedRoute requireAuth={true}>
                      <ApplicationPrint />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admission/admitcard/print/:applicationId" 
                  element={
                    <ProtectedRoute requireAuth={true}>
                      <AdmissionTestAdmit />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admission" 
                  element={
                    <ProtectedRoute requireAuth={true}>
                      <Admission />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Auth Routes */}
                <Route path="/login" element={<PublicLogin />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                
                {/* Admin Routes */}
                <Route 
                  path="/admin/*" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminRoutes />
                    </ProtectedRoute>
                  } 
                />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </main>
          <Toaster position="top-right" />
        </div>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
