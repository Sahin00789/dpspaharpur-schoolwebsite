import React, { useEffect, useState, useRef } from 'react';
import { 
  FiDownload, 
  FiPrinter,
  FiEdit2,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar
} from 'react-icons/fi';
import { 
  FaSpinner, 
  FaCheckCircle as FaCheck, 
  FaTimesCircle, 
  FaClock as FaClockIcon, 
  FaEdit,
  FaPlus
} from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import ApplicationPrint from './components/ApplicationPrint';
import AdmissionTestAdmit from './components/AdmissionTestAdmit';

const statusMap = {
  pending: {
    text: 'Under Review',
    icon: <FaClockIcon className="h-5 w-5 text-yellow-500" />,
    bg: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    description: 'Your application is under review. Please check back later for updates.',
    withRemarks: false
  },
  approved: {
    text: 'Approved',
    icon: <FaCheck className="h-5 w-5 text-green-500" />,
    bg: 'bg-green-100',
    textColor: 'text-green-800',
    description: 'Your application has been approved! You can now download your admit card.',
    withRemarks: false
  },
  rejected: {
    text: 'Rejected',
    icon: <FaTimesCircle className="h-5 w-5 text-red-500" />,
    bg: 'bg-red-100',
    textColor: 'text-red-800',
    description: 'Your application has been rejected.',
    withRemarks: true
  },
  unlockToEditAndResubmit: {
    text: 'Resubmission Required',
    icon: <FaEdit className="h-5 w-5 text-orange-500" />,
    bg: 'bg-orange-100',
    textColor: 'text-orange-800',
    description: 'Your application requires some changes. Please review the remarks and resubmit your application.',
    withRemarks: true
  }
};

async function getApplicationByUserId(userId) {
  try {
    const docRef = doc(db, 'admissions', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting application:', error);
    throw error;
  }
}

const ApplicationStatus = ({ application: propApplication }) => {
  const { applicationId } = useParams();
  const { user } = useAuth();
  const [application, setApplication] = useState(propApplication);
  const [loading, setLoading] = useState(!propApplication);
  const [error, setError] = useState(null);
  const [generatingAdmitCard, setGeneratingAdmitCard] = useState(false);
  const [isStartingNew, setIsStartingNew] = useState(false);
  const navigate = useNavigate();
  const printRef = useRef();
  const admitCardRef = useRef();
  
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Not provided';
    try {
      const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const getFullName = () => {
    if (!application) return 'Not provided';
    const { firstName, lastName } = application;
    return [firstName, lastName].filter(Boolean).join(' ') || 'Not provided';
  };

  const getCurrentStatus = () => {
    if (!application || !application.status) return statusMap.pending;
    return statusMap[application.status] || statusMap.pending;
  };

  const currentStatus = getCurrentStatus();
  const canEdit = application?.status === 'unlockToEditAndResubmit';
  const canDownloadAdmit = application?.status === 'approved';

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        if (propApplication) {
          setApplication(propApplication);
          return;
        }
        
        if (applicationId) {
          const appRef = doc(db, 'applications', applicationId);
          const appSnap = await getDoc(appRef);
          
          if (appSnap.exists()) {
            const appData = { id: appSnap.id, ...appSnap.data() };
            
            if (user?.uid && appData.userId !== user.uid) {
              toast.error('You do not have permission to view this application');
              navigate('/admission');
              return;
            }
            
            setApplication(appData);
          } else {
            toast.error('Application not found');
            navigate('/admission');
          }
        } else if (user?.uid) {
          const appData = await getApplicationByUserId(user.uid);
          setApplication(appData);
        }
      } catch (err) {
        console.error('Error fetching application:', err);
        setError('Failed to load application. Please try again later.');
        toast.error('Failed to load application');
        navigate('/admission');
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplication();
  }, [user?.uid, propApplication, applicationId, navigate]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Application_${application?.id || ''}`,
    onAfterPrint: () => {},
    pageStyle: `
      @page { size: A4; margin: 15mm 10mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    `
  });

  const handlePrintAdmitCard = useReactToPrint({
    content: () => admitCardRef.current,
    documentTitle: `AdmitCard_${application?.id || ''}`,
    onAfterPrint: () => {},
    pageStyle: `
      @page { size: A4; margin: 15mm 10mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    `
  });

  const handleDownloadAdmitCard = async () => {
    try {
      setGeneratingAdmitCard(true);
      await handlePrintAdmitCard();
    } catch (err) {
      console.error('Error generating admit card:', err);
      setError('Failed to generate admit card. Please try again.');
    } finally {
      setGeneratingAdmitCard(false);
    }
  };

  const handleEditApplication = () => {
    if (application?.applicationNumber) {
      const cleanAppNumber = application.applicationNumber.replace(/[^a-zA-Z0-9]/g, '');
      navigate(`/admission/application/edit/${cleanAppNumber}`);
    } else if (application?.id) {
      navigate(`/admission/application/edit/${application.id}`);
    } else {
      toast.error('Cannot edit application: Application information is incomplete');
    }
  };

  const handleStartNewApplication = async () => {
    if (!user?.uid) {
      toast.error('Please sign in to start a new application');
      return;
    }

    try {
      setIsStartingNew(true);
      const newAppRef = await addDoc(collection(db, 'applications'), {
        userId: user.uid,
        status: 'draft',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      navigate(`/admission/apply/new`);
    } catch (error) {
      console.error('Error creating new application:', error);
      toast.error('Failed to start new application. Please try again.');
      setIsStartingNew(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <p className="text-red-700">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors mt-2"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-lg shadow">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
            <FiPrinter className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-2xl font-medium text-gray-900 mb-2">No Application Found</h3>
          <p className="text-gray-600 mb-6">You haven't submitted an application yet. Start your admission process now.</p>
          <button
            onClick={handleStartNewApplication}
            disabled={isStartingNew}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isStartingNew ? (
              <FaSpinner className="animate-spin -ml-1 mr-2 h-5 w-5" />
            ) : (
              <FaPlus className="-ml-1 mr-2 h-5 w-5" />
            )}
            {isStartingNew ? 'Creating...' : 'Start New Application'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 border-2 rounded-xl">
      {/* Status Card */}
      <div className="border rounded-lg shadow-sm overflow-hidden mb-8">
        <div className={`p-4 border-b ${currentStatus?.bg || 'bg-gray-100'} ${currentStatus?.textColor || 'text-gray-800'}`}>
          <div className="flex items-start">
            {application.photo ? (
              <img 
                src={application.photo} 
                alt="Student" 
                className="h-16 w-16 rounded-full border-2 border-white shadow-sm mr-4 object-cover"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-4">
                <FiUser className="h-8 w-8" />
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{getFullName()}</h2>
              <div className="flex items-center mt-1">
                <div className="flex-shrink-0">
                  {currentStatus.icon}
                </div>
                <div className="ml-2">
                  <span className="font-medium">{currentStatus.text}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white">
          <p className="text-sm text-gray-700">{currentStatus.description}</p>
          
          {currentStatus.withRemarks && application.remarks && (
            <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
              <h4 className="font-medium text-sm">Remarks:</h4>
              <p className="text-sm mt-1">{application.remarks}</p>
            </div>
          )}
          
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiPrinter className="mr-2 h-4 w-4" />
              Print Application
            </button>
            
            {canDownloadAdmit && (
              <button
                onClick={handleDownloadAdmitCard}
                disabled={generatingAdmitCard}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {generatingAdmitCard ? (
                  <>
                    <FaSpinner className="animate-spin mr-2 h-4 w-4" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FiDownload className="mr-2 h-4 w-4" />
                    Download Admit Card
                  </>
                )}
              </button>
            )}
            
            {canEdit && (
              <button
                onClick={handleEditApplication}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <FiEdit2 className="mr-2 h-4 w-4" />
                Edit & Resubmit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Application Details */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Application Details</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Application ID: {application.id}</p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          {/* Personal Information */}
          <div className="mb-8">
            <h4 className="text-md font-medium text-gray-900 mb-4 pb-2 border-b">Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <FiUser className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="text-sm text-gray-900">{getFullName()}</p>
                </div>
              </div>
              <div className="flex items-start">
                <FiCalendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                  <p className="text-sm text-gray-900">{formatDate(application.dateOfBirth)}</p>
                </div>
              </div>
              <div className="flex items-start">
                <FiMail className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-sm text-gray-900">{application.email || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-start">
                <FiPhone className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-sm text-gray-900">{application.phone || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-start md:col-span-2">
                <FiMapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="text-sm text-gray-900">
                    {application.address || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4 pb-2 border-b">Documents</h4>
            {application.documents?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {application.documents.map((doc, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center">
                      <FiDownload className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.type}</p>
                      </div>
                    </div>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      View Document
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No documents uploaded.</p>
            )}
          </div>
        </div>
      </div>

      {/* Hidden components for printing */}
      <div className="hidden">
        {application && (
          <div ref={printRef}>
            <ApplicationPrint application={application} status={currentStatus} />
          </div>
        )}
        {canDownloadAdmit && application && (
          <div ref={admitCardRef}>
            <AdmissionTestAdmit application={application} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationStatus;