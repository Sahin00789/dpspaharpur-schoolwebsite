import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import AdmissionPanel from './components/AdmissionPanel';

const Admissions = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      toast.error('Please log in to access this page');
      navigate('/admin/login', { state: { from: '/admin/admissions' } });
      return;
    }

    // Check if user is admin
    if (!user.isAdmin) {
      toast.error('You do not have permission to access this page');
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Admission Management
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            View and manage student admission applications
          </p>
        </div>
      </div>
      
      <AdmissionPanel />
    </div>
  );
};

export default Admissions;
