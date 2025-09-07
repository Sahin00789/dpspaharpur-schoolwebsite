import React, { useState, useEffect } from 'react';
import { 
  FiChevronLeft, 
  FiExternalLink, 
  FiLock, 
  FiUnlock, 
  FiRefreshCw 
} from 'react-icons/fi';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

const StatusBadge = ({ status }) => {
  const statusMap = {
    pending: {
      text: 'Pending',
      className: 'bg-yellow-100 text-yellow-800',
      icon: '⏳'
    },
    approved: {
      text: 'Approved',
      className: 'bg-green-100 text-green-800',
      icon: '✓'
    },
    rejected: {
      text: 'Rejected',
      className: 'bg-red-100 text-red-800',
      icon: '✗'
    },
    under_review: {
      text: 'Under Review',
      className: 'bg-blue-100 text-blue-800',
      icon: '🔍'
    }
  };

  const statusInfo = statusMap[status] || statusMap.pending;
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.className}`}>
      {statusInfo.icon} {statusInfo.text}
    </span>
  );
};

const ApplicationDetail = ({ application, onBack, onApprove, onReject, onGenerateAdmitCard, onUpdate, isProcessing }) => {
  const [isLocked, setIsLocked] = useState(application?.locked ?? true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  useEffect(() => {
    if (application) {
      setIsLocked(application.locked ?? true);
    }
  }, [application]);

  if (!application) return null;

  const toggleLock = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      const newLockState = !isLocked;
      await onUpdate(application.id, { locked: newLockState });
      setIsLocked(newLockState);
      toast.success(`Application ${newLockState ? 'locked' : 'unlocked'} successfully`);
    } catch (error) {
      console.error('Error updating lock status:', error);
      toast.error(`Failed to ${isLocked ? 'unlock' : 'lock'} application`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Application Details</h2>
          <p className="text-sm text-gray-500">ID: {application.id}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={toggleLock}
            disabled={isUpdating}
            className={`p-2 rounded-md ${isLocked ? 'bg-gray-100 text-gray-700' : 'bg-yellow-100 text-yellow-700'} hover:bg-opacity-80 transition-colors`}
            title={isLocked ? 'Unlock for Editing' : 'Lock Application'}
          >
            {isUpdating ? (
              <FiRefreshCw className="animate-spin h-5 w-5" />
            ) : isLocked ? (
              <FiUnlock size={20} />
            ) : (
              <FiLock size={20} />
            )}
          </button>
          <button 
            onClick={onBack}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <FiChevronLeft className="mr-1" /> Back to List
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Photo */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-4 rounded-lg h-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Student Photo</h3>
            {application.photo ? (
              <div className="aspect-w-3 aspect-h-4 rounded-lg overflow-hidden">
                <img 
                  src={application.photo} 
                  alt="Student" 
                  className="object-cover w-full h-64"
                />
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                No photo available
              </div>
            )}
          </div>
        </div>

        {/* Student Information */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Student Information</h3>
              <StatusBadge status={application.status} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <p className="text-gray-900">{application.firstName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <p className="text-gray-900">{application.lastName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <p className="text-gray-900">{application.classApplyingFor || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <p className="text-gray-900">{application.gender || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <p className="text-gray-900">{application.dateOfBirth || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Previous School</label>
                <p className="text-gray-900">{application.previousSchool || 'N/A'}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Parent Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
                <p className="text-gray-900">{application.fatherName || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label>
                <p className="text-gray-900">{application.motherName || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent's Phone</label>
                <p className="text-gray-900">{application.parentPhone || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{application.email || 'N/A'}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <p className="text-gray-900 whitespace-pre-line">{application.address || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Application Status</h3>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  application.locked 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {application.locked ? (
                    <>
                      <FiLock className="h-3 w-3 mr-1" /> Locked
                    </>
                  ) : (
                    <>
                      <FiUnlock className="h-3 w-3 mr-1" /> Unlocked
                    </>
                  )}
                </span>
                <StatusBadge status={application.status} />
              </div>
            </div>
            
            <div className="text-sm text-gray-500 mb-4">
              <p>Submitted on: {application.submittedAt ? format(new Date(application.submittedAt), 'MMM d, yyyy hh:mm a') : 'N/A'}</p>
              {application.updatedAt && (
                <p>Last updated: {format(new Date(application.updatedAt), 'MMM d, yyyy hh:mm a')}</p>
              )}
            </div>
            </div>
            
            {application.rejectionReason && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
                <p className="font-medium">Reason for Rejection:</p>
                <p>{application.rejectionReason}</p>
              </div>
            )}
            
            {application.examDate && application.status === 'approved' && (
              <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-md">
                <h4 className="font-medium mb-2">Exam Details:</h4>
                <p>Date: {format(new Date(application.examDate), 'MMMM d, yyyy')}</p>
                <p>Time: {application.examTime || '10:00 AM'}</p>
                <p>Venue: {application.examVenue || 'Main Campus'}</p>
              </div>
            )}
            
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3">
                {application.status === 'pending' && (
                  <>
                    <button
                      onClick={() => onApprove(application)}
                      disabled={isProcessing}
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      {isProcessing ? 'Processing...' : 'Approve Application'}
                    </button>
                    <button
                      onClick={() => onReject(application)}
                      disabled={isProcessing}
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      {isProcessing ? 'Processing...' : 'Reject Application'}
                    </button>
                  </>
                )}
                
                {application.status === 'approved' && (
                  <button
                    onClick={() => onGenerateAdmitCard(application)}
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isProcessing ? 'Generating...' : 'Generate Admit Card'}
                  </button>
                )}
                
                {application.admitCardUrl && (
                  <a
                    href={application.admitCardUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FiExternalLink className="mr-2" /> View Admit Card
                  </a>
                )}
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Document Actions</h4>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={toggleLock}
                    disabled={isUpdating || isProcessing}
                    className={`flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-md ${
                      isLocked 
                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                        : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    }`}
                  >
                    {isUpdating ? (
                      <FiRefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    ) : isLocked ? (
                      <>
                        <FiUnlock className="mr-1.5 h-3.5 w-3.5" />
                        Unlock for Editing
                      </>
                    ) : (
                      <>
                        <FiLock className="mr-1.5 h-3.5 w-3.5" />
                        Lock Application
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
  );
};

export default ApplicationDetail;
