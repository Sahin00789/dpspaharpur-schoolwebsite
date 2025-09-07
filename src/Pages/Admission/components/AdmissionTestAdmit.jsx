import React from 'react';
import { format } from 'date-fns';
import { FaUser, FaCalendarAlt, FaSchool, FaIdCard } from 'react-icons/fa';

const AdmissionTestAdmit = React.forwardRef(({ application }, ref) => {
  if (!application) return null;

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      const d = date.toDate ? date.toDate() : new Date(date);
      return format(d, 'MMMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  return (
    <div ref={ref} className="p-8 bg-white text-gray-800 max-w-4xl mx-auto">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-container, .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4;
            margin: 15mm 10mm;
          }
        }
      `}</style>

      <div className="border-2 border-gray-200 p-6 rounded-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dina Public School, Paharpur</h1>
          <h2 className="text-xl font-semibold text-blue-700">Admission Test Admit Card</h2>
          <div className="mt-2 text-sm text-gray-500">
            Valid for Academic Year {new Date().getFullYear()}-{new Date().getFullYear() + 1}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Student Photo */}
          <div className="flex justify-center">
            <div className="h-40 w-32 border-2 border-gray-300 rounded flex items-center justify-center bg-gray-50">
              {application.photoUrl ? (
                <img 
                  src={application.photoUrl} 
                  alt="Student" 
                  className="h-full w-full object-cover"
                />
              ) : (
                <FaUser className="h-16 w-16 text-gray-400" />
              )}
            </div>
          </div>

          {/* Student Details */}
          <div className="md:col-span-2 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Application ID</p>
                <p className="font-medium">{application.id || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Class Applying For</p>
                <p className="font-medium">{application.classApplyingFor || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Student Name</p>
                <p className="font-medium">{application.studentName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">{formatDate(application.dob)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Father's Name</p>
                <p className="font-medium">{application.fatherName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact Number</p>
                <p className="font-medium">{application.phoneNumber || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Test Details */}
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold mb-4 text-center">Examination Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Test Date & Time</h4>
              <div className="flex items-center space-x-2">
                <FaCalendarAlt className="text-blue-600" />
                <div>
                  <p className="font-medium">{application.examDate ? formatDate(application.examDate) : 'To be announced'}</p>
                  <p className="text-sm text-gray-600">{application.examTime || '10:00 AM - 12:00 PM'}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Reporting Time</h4>
              <p className="text-sm text-gray-700">Please report 30 minutes before the test time with this admit card and a valid photo ID proof.</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 text-sm text-gray-600">
          <h4 className="font-medium text-gray-800 mb-2">Instructions:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Bring this admit card and a valid photo ID proof (Aadhaar Card/Birth Certificate).</li>
            <li>Carry your own stationery (pens, pencils, erasers, etc.).</li>
            <li>No electronic devices allowed in the examination hall.</li>
            <li>Latecomers will not be allowed to enter the examination hall.</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-dashed text-center text-xs text-gray-500">
          <p>This is a computer-generated document. No signature is required.</p>
          <p className="mt-1">© {new Date().getFullYear()} Dina Public School, Paharpur. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
});

AdmissionTestAdmit.displayName = 'AdmissionTestAdmit';
export default AdmissionTestAdmit;
