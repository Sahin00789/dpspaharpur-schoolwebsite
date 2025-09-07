import React from 'react';

const DashedLine = () => (
  <div className="border-b border-dashed border-gray-300 h-4 my-1"></div>
);

const Field = ({ label, value, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    <div className="text-xs text-teal-700 font-semibold mb-1">{label}</div>
    <div className="border-b border-gray-300 pb-1">{value || '__________'}</div>
  </div>
);

const CheckboxField = ({ label, checked = false }) => (
  <div className="flex items-center gap-2 mb-2">
    <div className={`w-4 h-4 border ${checked ? 'bg-teal-500' : 'bg-white'} border-gray-400 rounded flex items-center justify-center`}>
      {checked && (
        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
    <span className="text-sm">{label}</span>
  </div>
);

const ApplicationPrint = React.forwardRef(({ applicationData = {} }, ref) => {
  const [currentDate] = React.useState(new Date().toLocaleDateString('en-GB'));
  // Default data to prevent undefined errors
  const data = {
    formNumber: '__________',
    date: currentDate,
    appliedClass: '__________',
    rollNumber: '__________',
    phone: '__________',
    email: '__________',
    address: '__________',
    studentName: '__________',
    fatherName: '__________',
    motherName: '__________',
    dob: '__________',
    gender: '__________',
    previousSchool: '__________',
    aadhar: '__________',
    category: '__________',
    ...applicationData
  };

  return (
    <div ref={ref} className="w-[210mm] min-h-[297mm] bg-[#f6f9fb] p-[18mm_12mm] box-border">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-teal-600 to-sky-600 text-white px-8 py-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-md overflow-hidden flex items-center justify-center p-1">
                <img 
                  src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQDxAPEBAQDxAQDw8QEBAQEBAQEA8QFREXFhUVFRUYHSggGBolGxUVITEhJSkrLi4uFx8zODMsNygtLisBCgoKDg0OGhAQGi0lHx8rLS0tLS0tLS0tLS0tLSstLS0tLS8tLS0tLS0tLSs3LS0tLS0tLTctLS0tLS0tLS0tLf/AABEIAioCKgMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAQIDBAUGB//EAE0QAAEEAAMCCAoXBwYHAAIDAAEAAgMRBBIhEzEFIkFRUmGR0QYUFjc4GSk9IVIzNUYqGxB0KjsvAkY3KCosE0Q0TCw+Hxc4RkdIP/xAAaAQEBAQEBAQEAAAAAAAAAAAAAAQIDBAUG/8QANhEBAAECAwUGBQMDBQAAAAAAAAECEQMSUQQTUpahBRUhYeHwFCIxQYFicdEjMrFTgqLB8ST/2gAMAwEAAhEDED"

                  alt="logo" 
                  style={{width: '100%', height: '100%', objectFit: 'cover'}}
                />
              </div>
              <div>
                <div className="text-2xl font-extrabold tracking-tight">DINA PUBLIC SCHOOL</div>
                <div className="text-sm opacity-90">Paharpur • Estd. 2022 • MMDCT</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">Admission Test Application</div>
              <div className="text-sm opacity-90">Session: 2025-26</div>
            </div>
          </div>
          {/* subtle centered tag */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-6 bg-white text-teal-700 px-6 py-2 rounded-md font-semibold shadow">
            ADMISSION TEST APPLICATION
          </div>
        </div>

        {/* Body */}
        <div className="px-8 pt-10 pb-8">
          {/* Info cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-xs text-teal-600 font-semibold mb-2">FORM</div>
              <div className="text-sm">Form No: <span className="font-medium">{data.formNumber}</span></div>
              <div className="text-sm">Date: <span className="font-medium">{data.date}</span></div>
              <div className="text-sm">Test Center: <span className="font-medium">Dina Public School</span></div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-xs text-teal-600 font-semibold mb-2">APPLICANT</div>
              <div className="text-sm">Applied Class: <span className="font-medium">{data.appliedClass}</span></div>
              <div className="text-sm">Session: <span className="font-medium">2025-26</span></div>
              <div className="text-sm">Roll No: <span className="font-medium">{data.rollNumber}</span></div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-xs text-teal-600 font-semibold mb-2">CONTACT</div>
              <div className="text-sm">Phone: <span className="font-medium">{data.phone}</span></div>
              <div className="text-sm">Email: <span className="font-medium">{data.email}</span></div>
              <div className="text-sm">Address: <span className="font-medium">{data.address}</span></div>
            </div>
          </div>

          {/* Student Information */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold text-teal-700 mb-4 pb-2 border-b border-gray-200">
              Student Information
            </h3>
            
            <div className="grid grid-cols-2 gap-6 mb-4">
              <Field label="Full Name of the Student" value={data.studentName} />
              <Field label="Date of Birth (DD/MM/YYYY)" value={data.dob} />
              <Field label="Gender" value={data.gender} />
              <Field label="Aadhar Number" value={data.aadhar} />
              <Field label="Category" value={data.category} />
              <Field label="Previous School (if any)" value={data.previousSchool} />
            </div>

            <h4 className="text-md font-medium text-teal-700 mt-6 mb-3">Documents Attached:</h4>
            <div className="grid grid-cols-2 gap-4">
              <CheckboxField label="Birth Certificate" checked={true} />
              <CheckboxField label="Aadhar Card" checked={true} />
              <CheckboxField label="Previous School TC" checked={true} />
              <CheckboxField label="Caste Certificate (if applicable)" checked={false} />
              <CheckboxField label="Passport Size Photo (2)" checked={true} />
              <CheckboxField label="Address Proof" checked={true} />
            </div>
          </div>

          {/* Parent/Guardian Information */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold text-teal-700 mb-4 pb-2 border-b border-gray-200">
              Parent/Guardian Information
            </h3>
            
            <div className="grid grid-cols-2 gap-6">
              <Field label="Father's Name" value={data.fatherName} />
              <Field label="Mother's Name" value={data.motherName} />
              <Field label="Contact Number" value={data.phone} />
              <Field label="Email Address" value={data.email} />
              <div className="col-span-2">
                <Field label="Residential Address" value={data.address} />
              </div>
            </div>
          </div>

          {/* Declaration */}
          <div className="bg-amber-50 p-6 rounded-lg border border-amber-200 mb-6">
            <h3 className="text-lg font-semibold text-amber-700 mb-3">Declaration</h3>
            <p className="text-sm text-gray-700 mb-4">
              I hereby declare that all the information provided in this application is true and correct to the best of my knowledge.
              I understand that any false information may lead to cancellation of admission.
            </p>
            
            <div className="flex justify-between mt-6">
              <div className="w-1/3">
                <DashedLine />
                <div className="text-center text-sm mt-1">Parent/Guardian Signature</div>
              </div>
              <div className="w-1/3">
                <DashedLine />
                <div className="text-center text-sm mt-1">Student Signature (if applicable)</div>
              </div>
              <div className="w-1/3">
                <DashedLine />
                <div className="text-center text-sm mt-1">Date: {data.date}</div>
              </div>
            </div>
          </div>

          {/* Office Use Only */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
            <h4 className="font-medium text-gray-700 mb-2">For Office Use Only</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <DashedLine />
                <div className="text-sm text-gray-600 mt-1">Application Received By</div>
              </div>
              <div>
                <DashedLine />
                <div className="text-sm text-gray-600 mt-1">Application Status</div>
              </div>
              <div>
                <DashedLine />
                <div className="text-sm text-gray-600 mt-1">Remarks</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
});

ApplicationPrint.displayName = 'ApplicationPrint';

export default ApplicationPrint;