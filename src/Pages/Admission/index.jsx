import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmissionAuth } from '../../hooks/useAdmissionAuth';
import { toast } from 'react-hot-toast';
import { FaPlus } from 'react-icons/fa';
import ApplicationStatus from './ApplicationStatus';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

const Admission = () => {
  const navigate = useNavigate();
  const { 
    user, 
    application, 
    loading: authLoading, 
    error, 
    handleSignIn 
  } = useAdmissionAuth();
  
  const [isLoading, setIsLoading] = useState(false);

  const handleNewApplication = async () => {
    if (!user) {
      try {
        setIsLoading(true);
        await handleSignIn();
        navigate('/admission/apply/new');
      } catch (error) {
        console.error('Sign in error:', error);
        toast.error(error.message || 'Failed to sign in. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      navigate('/admission/apply/new');
    }
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return <LoadingSpinner />;
  }

  // If application exists, show application status and details
  if (application) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <ApplicationStatus application={application} />
        
        {application.status !== 'rejected' && application.status !== 'unlockToEditAndResubmit' && (
          <div className="text-center mt-8">
            <button
              onClick={handleNewApplication}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              disabled={isLoading}
            >
              <FaPlus className="mr-2" />
              {isLoading ? 'Loading...' : 'Start New Application'}
            </button>
          </div>
        )}
      </div>
    );
  }

  // Default view when no application exists
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Admission Portal</h1>
          <p className="text-lg text-gray-600 mb-8">
            Welcome to our admission portal. Start your application process by clicking the button below.
          </p>
          <button
            onClick={handleNewApplication}
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            disabled={isLoading}
          >
            <FaPlus className="mr-2" />
            {isLoading ? 'Loading...' : 'Start New Application'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admission;