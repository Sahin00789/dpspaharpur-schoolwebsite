import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiEye,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiMapPin,
  FiLock,
  FiUnlock,
  FiDownload
} from 'react-icons/fi';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import useAdmissionStore from '../../../store/useAdmissionStore';
import ApplicationDetail from './ApplicationDetail';

// Get status badge
const getStatusBadge = (status) => {
  const baseClasses = 'px-2.5 py-1 text-xs font-medium rounded-full flex items-center';
  
  const statusConfig = {
    approved: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
      icon: <FiCheckCircle className="mr-1.5 h-3.5 w-3.5 flex-shrink-0" />,
      label: 'Approved'
    },
    rejected: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      icon: <FiXCircle className="mr-1.5 h-3.5 w-3.5 flex-shrink-0" />,
      label: 'Rejected'
    },
    pending: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
      icon: <FiClock className="mr-1.5 h-3.5 w-3.5 flex-shrink-0" />,
      label: 'Pending'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;
  
  return (
    <span className={`${baseClasses} ${config.bg} ${config.text} ${config.border} border`}>
      {config.icon}
      {config.label}
    </span>
  );
};

const ApplicationCard = ({ application, onStatusUpdate, onLockUpdate, onViewDetails, isProcessing }) => {
  const isApproved = application.status === 'approved';
  const isRejected = application.status === 'rejected';
  const isPending = application.status === 'pending' || !application.status;
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden hover:border-indigo-100">
      {/* Header with status */}
      <div className="px-4 pt-4 pb-2 flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center">
              <FiUser className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-gray-900 truncate">{application.studentName || 'N/A'}</h3>
              <p className="text-xs text-indigo-600 font-medium">#{application.applicationId || 'N/A'}</p>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0">
          {getStatusBadge(application.status || 'pending')}
        </div>
      </div>

      {/* Details */}
      <div className="px-4 py-3 space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-start">
            <FiMail className="h-4 w-4 mt-0.5 mr-2 text-gray-400 flex-shrink-0" />
            <span className="truncate text-gray-600">{application.email || 'N/A'}</span>
          </div>
          <div className="flex items-start">
            <FiPhone className="h-4 w-4 mt-0.5 mr-2 text-gray-400 flex-shrink-0" />
            <span className="text-gray-600">{application.phone || 'N/A'}</span>
          </div>
          <div className="flex items-start">
            <FiCalendar className="h-4 w-4 mt-0.5 mr-2 text-gray-400 flex-shrink-0" />
            <span className="text-gray-600">Class {application.class || 'N/A'}</span>
          </div>
          <div className="flex items-start">
            <FiCalendar className="h-4 w-4 mt-0.5 mr-2 text-gray-400 flex-shrink-0" />
            <span className="text-gray-600">{application.createdAt ? format(new Date(application.createdAt), 'MMM d, yyyy') : 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-4 pt-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onStatusUpdate(application.id, 'approved')}
            disabled={isProcessing || isApproved}
            className={`flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              isApproved
                ? 'bg-green-50 text-green-700 border border-green-100'
                : 'bg-white text-green-600 border border-green-200 hover:bg-green-50'
            }`}
          >
            {isApproved ? '✓ Approved' : 'Approve'}
          </button>
          
          <button
            onClick={() => onStatusUpdate(application.id, 'rejected')}
            disabled={isProcessing || isRejected}
            className={`flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              isRejected
                ? 'bg-red-50 text-red-700 border border-red-100'
                : 'bg-white text-red-600 border border-red-200 hover:bg-red-50'
            }`}
          >
            {isRejected ? '✓ Rejected' : 'Reject'}
          </button>
          
          <button
            onClick={() => onLockUpdate(application.id, !application.locked)}
            disabled={isProcessing}
            className={`flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
              application.locked
                ? 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100'
                : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'
            }`}
          >
            {application.locked ? '✓ Unlocked' : 'Unlock to Edit'}
          </button>
          
          <button
            onClick={() => onViewDetails(application)}
            className="flex items-center justify-center px-3 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            <FiEye className="mr-1.5 h-4 w-4" />
            Preview
          </button>
        </div>
      </div>
    </div>
  );
};

const AdmissionPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isProcessing, setIsProcessing] = useState(false);
  // Use the store
  const { 
    applications, 
    loading, 
    error,
    fetchApplications,
    updateApplicationStatus: updateStatus
  } = useAdmissionStore();

  // Fetch applications when status filter changes
  useEffect(() => {
    fetchApplications();
  }, [statusFilter, fetchApplications]);
  
  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  
  // Filter applications based on search term and status
  const filteredApplications = applications.filter(app => {
    if (statusFilter !== 'all' && app.status !== statusFilter) return false;
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      app.studentName?.toLowerCase().includes(searchLower) ||
      app.fatherName?.toLowerCase().includes(searchLower) ||
      app.motherName?.toLowerCase().includes(searchLower) ||
      app.phone?.includes(searchTerm) ||
      app.email?.toLowerCase().includes(searchLower) ||
      app.applicationId?.toLowerCase().includes(searchLower)
    );
  });

  // Handle status update
  const handleStatusUpdate = async (id, status) => {
    try {
      setIsProcessing(true);
      await updateStatus(id, { status });
      toast.success(`Application ${status} successfully`);
      fetchApplications(); // Refresh the list
    } catch (error) {
      toast.error(`Failed to update application status: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // View application details
  const viewDetails = (application) => {
    setSelectedApplication(application);
    setIsViewingDetails(true);
  };

  // Handle lock/unlock application
  const handleLockUpdate = async (id, locked) => {
    try {
      setIsProcessing(true);
      await updateStatus(id, { locked });
      toast.success(`Application ${locked ? 'locked' : 'unlocked'} successfully`);
      fetchApplications(); // Refresh the list
    } catch (error) {
      toast.error(`Failed to ${locked ? 'lock' : 'unlock'} application: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Render the component
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      {/* Search and Filter Bar */}
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <button
              onClick={() => fetchApplications()}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <FiRefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Applications Grid */}
      <div className="bg-white">
        {loading && applications.length === 0 ? (
          <div className="flex justify-center items-center p-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-3 text-sm font-medium text-gray-700">Loading applications...</p>
            </div>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-indigo-50 mb-4">
              <FiUser className="h-12 w-12 text-indigo-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No applications found</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              {statusFilter === 'all' 
                ? 'There are no applications to display at the moment.' 
                : `No ${statusFilter} applications found. Try adjusting your filters.`}
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('all');
                  setSearchTerm('');
                }}
                className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <FiRefreshCw className="-ml-1 mr-2 h-4 w-4" />
                Reset all filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 p-4 sm:p-6">
            {filteredApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onStatusUpdate={handleStatusUpdate}
                onLockUpdate={handleLockUpdate}
                onViewDetails={viewDetails}
                isProcessing={isProcessing}
              />
            ))}
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      {isViewingDetails && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">Application Details</h3>
                <button
                  onClick={() => setIsViewingDetails(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-6">
                <ApplicationDetail 
                  application={selectedApplication} 
                  onBack={() => setIsViewingDetails(false)}
                  onApprove={() => handleStatusUpdate(selectedApplication.id, 'approved')}
                  onReject={() => handleStatusUpdate(selectedApplication.id, 'rejected')}
                  onLockUpdate={(id, locked) => handleLockUpdate(id, locked)}
                  onUpdate={(updates) => {
                    // Handle any updates to the application
                    fetchApplications();
                  }}
                  isProcessing={isProcessing}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmissionPanel;
