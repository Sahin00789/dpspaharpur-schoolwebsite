import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAdmissionAuth } from '../../hooks/useAdmissionAuth';
import { db, auth, storage } from '../../firebase';
import { collection, addDoc, getDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
  FiUser, 
  FiHome, 
  FiBook, 
  FiPrinter, 
  FiMail, 
  FiPhone, 
  FiCalendar, 
  FiMapPin, 
  FiCamera, 
  FiFile,
  FiUpload
} from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import schoolInfo from '../../hooks/useSchoolInfo';
import { useAuth } from '../../contexts/AuthContext';

// Photo validation function
const validatePhoto = (file) => {
  if (!file) return 'Photo is required';
  
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const maxSize = 200 * 1024; // 200KB
  
  if (!validTypes.includes(file.type)) {
    return 'Only JPG, JPEG, and PNG files are allowed';
  }
  
  if (file.size > maxSize) {
    return 'Photo size should be less than 200KB';
  }
  
  return null;
};

// Form validation schema
const admissionSchema = yup.object().shape({
  // Student Information
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  dateOfBirth: yup.date().required('Date of birth is required'),
  gender: yup.string().required('Gender is required'),
  nationality: yup.string().required('Nationality is required'),
  caste: yup.string().required('Caste is required'),
  
  // Contact Information
  village: yup.string().required('Village/Town is required'),
  postOffice: yup.string().required('Post Office is required'),
  policeStation: yup.string().required('Police Station is required'),
  district: yup.string().required('District is required'),
  state: yup.string().required('State is required'),
  pinCode: yup
    .string()
    .required('PIN Code is required')
    .matches(/^\d{6}$/, 'PIN Code must be 6 digits'),
  
  // Parent Information
  fatherName: yup.string().required("Father's name is required"),
  motherName: yup.string().required("Mother's name is required"),
  parentPhone: yup
    .string()
    .required("Parent's phone number is required")
    .matches(/^\d{10}$/, 'Phone number must be 10 digits'),
  
  // Academic Information
  classApplyingFor: yup.string().required('Class is required'),
  previousSchool: yup.string().required('Previous school is required'),
  
  // Documents
  photo: yup.mixed().test('file', 'Student photo is required', (value) => {
    return value && value instanceof File;
  }),
  birthCertificate: yup.mixed().test('file', 'Birth certificate is required', (value) => {
    return value && value instanceof File;
  }),
});



// Component for the loading state
const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading application form...</p>
    </div>
  </div>
);

// Main component
const ApplyForm = () => {
  const { applicationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError] = useState('');
  const [birthCertPreview, setBirthCertPreview] = useState(null);
  const [birthCertError, setBirthCertError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isNewApplication, setIsNewApplication] = useState(!applicationId);
  const [existingApplication, setExistingApplication] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  
  // Form methods
  const formMethods = useForm({
    resolver: yupResolver(admissionSchema),
    defaultValues: {
      // Student Information
      firstName: '',
      lastName: '',
      email: '',
      dateOfBirth: '',
      gender: '',
      nationality: 'Indian',
      caste: '',
      
      // Contact Information
      village: '',
      postOffice: '',
      policeStation: '',
      district: '',
      state: '',
      pinCode: '',
      
      // Parent Information
      fatherName: '',
      motherName: '',
      parentPhone: '',
      
      // Academic Information
      classApplyingFor: '',
      previousSchool: '',
      
      // Documents
      photo: null,
      birthCertificate: null
    }
  });

  // Load application data if applicationId exists
  // Get current user
  const { user } = useAuth();
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const loadApplication = async () => {
      console.log('[DEBUG] Load Application - Start');
      console.log('[DEBUG] Application ID from URL:', applicationId);
      console.log('[DEBUG] Current user:', user?.uid);
      
      if (!applicationId || !user) {
        console.error('[DEBUG] Missing required data:', { 
          hasApplicationId: !!applicationId, 
          hasUser: !!user 
        });
        return;
      }

      try {
        setLoading(true);
        console.log('[DEBUG] Fetching from Firestore collection: applications');
        const appRef = doc(db, 'applications', applicationId);
        console.log('[DEBUG] Document reference created:', appRef.path);
        
        console.log('[DEBUG] Executing getDoc...');
        const appSnap = await getDoc(appRef);
        
        console.log('[DEBUG] Document snapshot received. Exists:', appSnap.exists());
        if (appSnap.exists()) {
          console.log('[DEBUG] Document data:', appSnap.data());
        }
        if (appSnap.exists()) {
          const appData = appSnap.data();
          // Verify the user has permission to edit this application
          if (appData.userId !== user.uid) {
            toast.error('You do not have permission to edit this application');
            navigate('/admission');
            return;
          }
          
          // Check if application is locked
          if (appData.locked) {
            toast.error('This application is currently locked and cannot be edited. Please contact the administrator.');
            setIsLocked(true);
          }
          
          // Set existing application data
          setExistingApplication(appData);
          
          // Prepare form data with proper type conversion
          const formData = {
            ...appData,
            // Convert Firestore Timestamp to date string if needed
            dateOfBirth: appData.dateOfBirth?.toDate?.()?.toISOString().split('T')[0] || '',
            // Ensure all fields from the schema are included
            village: appData.village || '',
            postOffice: appData.postOffice || '',
            policeStation: appData.policeStation || '',
            district: appData.district || appData.city || '', // Fallback to city for backward compatibility
            state: appData.state || '',
            pinCode: appData.pinCode || ''
          };
          
          // Reset form with the loaded data
          formMethods.reset(formData);
          
          // Set photo preview if exists
          if (appData.photo) {
            setPhotoPreview(appData.photo);
          }
          
          // Set birth certificate preview if exists
          if (appData.birthCertificate) {
            setBirthCertPreview(appData.birthCertificate);
          }
        } else {
          console.error('[DEBUG] Application not found in Firestore');
          console.error('[DEBUG] Details:', {
            applicationId,
            user: user?.uid,
            timestamp: new Date().toISOString(),
            collection: 'applications'
          });
          
          // Add a small delay before redirecting to ensure logs are visible
          setTimeout(() => {
            toast.error('Application not found');
            navigate('/admission');
          }, 1000);
        }
      } catch (error) {
        console.error('Error loading application:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          stack: error.stack
        });
        toast.error('Failed to load application');
        navigate('/admission');
      } finally {
        setLoading(false);
      }
    };

    loadApplication();
  }, [applicationId, formMethods, navigate]);
  
  // Handle birth certificate selection
  const handleBirthCertChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
      setBirthCertError('Please upload a PDF, JPG, or PNG file');
      return;
    }
    
    if (file.size > maxSize) {
      setBirthCertError('File size should be less than 5MB');
      return;
    }
    
    // If it's an image, show preview
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBirthCertPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setBirthCertPreview(null);
    }
    
    // Set the file in the form
    formMethods.setValue('birthCertificate', [file]);
    setBirthCertError('');
  };
  
  // Handle photo selection
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const error = validatePhoto(file);
    if (error) {
      setPhotoError(error);
      return;
    }
    
    // Resize and compress the image
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 500; // Max width or height
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to base64
        canvas.toBlob((blob) => {
          const resizedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          
          formMethods.setValue('photo', resizedFile);
          setPhotoPreview(URL.createObjectURL(resizedFile));
          setPhotoError('');
        }, 'image/jpeg', 0.8);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };
  
  const { register, handleSubmit, formState: { errors }, setValue, reset, control } = formMethods;
  
  // Handle redirects and form initialization
  useEffect(() => {
    const initializeForm = async () => {
      try {
        // If we have an existing application, redirect to admission page
        if (existingApplication) {
          navigate('/admission');
          return;
        }

        // If user is logged in, initialize form with their data
        if (user) {
          reset({
            firstName: user.displayName?.split(' ')[0] || '',
            lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
            email: user.email || '',
          });
        }
      } catch (err) {
        console.error('Error initializing form:', err);
        toast.error('Failed to initialize form. Please try again.');
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    };

    if (user) {
      setAuthLoading(false);
      initializeForm();
    } else {
      setAuthLoading(false);
      setAuthChecked(true);
    }
  }, [user, navigate, reset, authLoading]);

  // Show loading state while checking auth or initializing
  if (loading || !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Application</h2>
          <p className="text-gray-600 max-w-md">Please wait while we prepare the admission form...</p>
        </div>
      </div>
    );
  }
  
  // Form sections configuration
  const formSections = [
    {
      id: 'student',
      title: 'Student Information',
      icon: <FiUser className="mr-2" />,
      fields: [
        { name: 'firstName', label: 'First Name', type: 'text', required: true, colSpan: 'col-span-6 sm:col-span-3' },
        { name: 'lastName', label: 'Last Name', type: 'text', required: true, colSpan: 'col-span-6 sm:col-span-3' },
        { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true, colSpan: 'col-span-6 sm:col-span-3' },
        { 
          name: 'gender', 
          label: 'Gender', 
          type: 'select', 
          options: ['Male', 'Female', 'Other'],
          required: true,
          colSpan: 'col-span-6 sm:col-span-3' 
        },
        { 
          name: 'nationality', 
          label: 'Nationality', 
          type: 'text',
          defaultValue: 'Indian',
          required: true,
          colSpan: 'col-span-6 sm:col-span-3' 
        },
        { 
          name: 'caste', 
          label: 'Caste', 
          type: 'select',
          options: ['General', 'OBC', 'SC', 'ST', 'Other'],
          required: true,
          colSpan: 'col-span-6 sm:col-span-3' 
        },
      ]
    },
    {
      id: 'contact',
      title: 'Contact Information',
      icon: <FiMapPin className="mr-2" />,
      fields: [
        { name: 'village', label: 'Village/Town', type: 'text', required: true, colSpan: 'col-span-6 sm:col-span-3' },
        { name: 'postOffice', label: 'Post Office', type: 'text', required: true, colSpan: 'col-span-6 sm:col-span-3' },
        { name: 'policeStation', label: 'Police Station', type: 'text', required: true, colSpan: 'col-span-6 sm:col-span-3' },
        { name: 'district', label: 'District', type: 'text', required: true, colSpan: 'col-span-6 sm:col-span-3' },
        { name: 'state', label: 'State', type: 'text', required: true, colSpan: 'col-span-6 sm:col-span-3' },
        { name: 'pinCode', label: 'PIN Code', type: 'text', required: true, placeholder: '6-digit PIN', colSpan: 'col-span-6 sm:col-span-3' },
        { name: 'email', label: 'Email', type: 'email', required: true, disabled: true, colSpan: 'col-span-6 sm:col-span-3' },
      ]
    },
    {
      id: 'parent',
      title: 'Parent/Guardian Information',
      icon: <FiUser className="mr-2" />,
      fields: [
        { name: 'fatherName', label: "Father's Name", type: 'text', required: true },
        { name: 'motherName', label: "Mother's Name", type: 'text', required: true },
        { 
          name: 'parentPhone', 
          label: "Parent's Mobile Number", 
          type: 'tel', 
          required: true,
          placeholder: '10-digit mobile number'
        },
      ]
    },
    {
      id: 'academic',
      title: 'Academic Information',
      icon: <FiBook className="mr-2" />,
      fields: [
        { 
          name: 'classApplyingFor', 
          label: 'Class Applying For', 
          type: 'select',
          options: schoolInfo.classes,
          required: true 
        },
        { 
          name: 'previousSchool', 
          label: 'Previous School Name', 
          type: 'text', 
          required: true,
          placeholder: 'Name of the last attended school'
        },
        { 
          name: 'lastClass', 
          label: 'Last Class Attended', 
          type: 'select',
          options: schoolInfo.classes.filter(c => c !== 'Nursery' && c !== 'LKG'),
          required: true 
        },
      ]
    }
  ];
  
  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      await handleSignIn();
      // The form will update automatically via the useEffect above
    } catch (error) {
      toast.error(error.message || 'Failed to sign in. Please try again.');
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error('Please sign in to submit the form');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    try {
      setIsSubmitting(true);
      setPhotoError('');

      // Validate photo
      if (!photoPreview) {
        setPhotoError('Please upload a photo');
        setIsSubmitting(false);
        return;
      }

      // Validate photo file type and size
      if (data.photo && data.photo[0]) {
        const photoError = validatePhoto(data.photo[0]);
        if (photoError) {
          setPhotoError(photoError);
          setIsSubmitting(false);
          return;
        }
      }

      // Validate birth certificate
      if (!data.birthCertificate || !data.birthCertificate[0]) {
        toast.error('Please upload a birth certificate');
        setIsSubmitting(false);
        return;
      }

      // Validate birth certificate file type and size
      const birthCertFile = data.birthCertificate[0];
      const validFileTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      const maxFileSize = 2 * 1024 * 1024; // 2MB
      
      if (!validFileTypes.includes(birthCertFile.type)) {
        toast.error('Birth certificate must be a PDF, JPG, or PNG file');
        setIsSubmitting(false);
        return;
      }
      
      if (birthCertFile.size > maxFileSize) {
        toast.error('Birth certificate file size must be less than 2MB');
        setIsSubmitting(false);
        return;
      }

      // Upload files to Firebase Storage
      const uploadFile = async (file, path) => {
        const storageRef = ref(storage, `${user.uid}/${path}/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
      };

      // Upload photo and birth certificate
      const [photoUrl, birthCertUrl] = await Promise.all([
        uploadFile(data.photo[0], 'photos'),
        uploadFile(data.birthCertificate[0], 'documents')
      ]);
      
      if (!photoUrl || !birthCertUrl) {
        throw new Error('Failed to upload files. Please try again.');
      }

      // Prepare application data
      const applicationData = {
        // Student Information
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        nationality: data.nationality,
        caste: data.caste,
        photoUrl,
        birthCertificateUrl: birthCertUrl,
        
        // Contact Information
        village: data.village,
        postOffice: data.postOffice,
        policeStation: data.policeStation,
        district: data.district,
        state: data.state,
        pinCode: data.pinCode,
        email: data.email || user.email,
        
        // Parent Information
        fatherName: data.fatherName,
        motherName: data.motherName,
        parentPhone: data.parentPhone,
        
        // Academic Information
        classApplyingFor: data.classApplyingFor,
        previousSchool: data.previousSchool,
        lastClass: data.lastClass,
        
        // System Fields
        status: 'pending',
        locked: true, // Lock the application by default
        updatedAt: serverTimestamp(),
        userId: user.uid,
      };

      if (applicationId) {
        // Update existing application
        await setDoc(doc(db, 'admissionApplications', applicationId), applicationData, { merge: true });
        toast.success('Application updated successfully!');
        navigate(`/admission/status/${applicationId}`);
      } else {
        // Create new application
        const docRef = await addDoc(collection(db, 'admissionApplications'), applicationData);
        toast.success('Application submitted successfully!');
        navigate(`/admission/status/${docRef.id}`);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error(error.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render birth certificate upload field
  const renderBirthCertField = () => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Birth Certificate <span className="text-red-500">*</span>
      </label>
      <div className="mt-1 flex items-center">
        <div className="relative">
          <div className="h-24 w-24 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
            {birthCertPreview ? (
              <img 
                src={birthCertPreview} 
                alt="Birth Certificate Preview" 
                className="h-full w-full object-contain p-1"
              />
            ) : (
              <div className="text-center p-2">
                <FiFile className="h-8 w-8 text-gray-400 mx-auto" />
                <span className="text-xs text-gray-500 mt-1 block">PDF/Image</span>
              </div>
            )}
          </div>
          <label
            htmlFor="birth-cert-upload"
            className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 border border-gray-300 shadow-sm cursor-pointer hover:bg-gray-50"
            title="Upload birth certificate"
          >
            <FiUpload className="h-4 w-4 text-gray-600" />
            <input
              id="birth-cert-upload"
              name="birthCertificate"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="sr-only"
              onChange={handleBirthCertChange}
            />
          </label>
        </div>
        <div className="ml-4">
          <button
            type="button"
            onClick={() => document.getElementById('birth-cert-upload').click()}
            className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Choose File
          </button>
          <p className="mt-1 text-xs text-gray-500">
            PDF, JPG, PNG (max 5MB)
          </p>
          {birthCertError && (
            <p className="mt-1 text-sm text-red-600">{birthCertError}</p>
          )}
          {errors.birthCertificate && (
            <p className="mt-1 text-sm text-red-600">{errors.birthCertificate.message}</p>
          )}
        </div>
      </div>
    </div>
  );

  // Render photo upload field
  const renderPhotoField = () => (
    <div className="mb-6">
      <div className="mt-1 flex items-center">
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-gray-200 overflow-hidden">
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400">
                <FiUser className="h-12 w-12" />
              </div>
            )}
          </div>
          <label
            htmlFor="photo-upload"
            className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 border border-gray-300 shadow-sm cursor-pointer hover:bg-gray-50"
            title="Upload photo"
          >
            <FiCamera className="h-5 w-5 text-gray-600" />
            <input
              id="photo-upload"
              name="photo"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handlePhotoChange}
            />
          </label>
        </div>
        <div className="ml-4">
          <button
            type="button"
            onClick={() => document.getElementById('photo-upload').click()}
            className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Choose Photo
          </button>
          <p className="mt-1 text-xs text-gray-500">
            JPG, PNG (max 200KB, 500x500px)
          </p>
          {photoError && (
            <p className="mt-1 text-sm text-red-600">{photoError}</p>
          )}
          {errors.photo && (
            <p className="mt-1 text-sm text-red-600">{errors.photo.message}</p>
          )}
        </div>
      </div>
    </div>
  );

  // Render document upload section
  const renderDocumentUploads = () => (
    <div className="bg-white shadow sm:rounded-lg p-6 mb-8">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <FiFile className="mr-2" />
          Document Uploads
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Please upload the required documents in the specified formats.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-4">Student Photo</h4>
          {renderPhotoField()}
        </div>
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-4">Birth Certificate</h4>
          {renderBirthCertField()}
        </div>
      </div>
    </div>
  );

  // Render a single form section
  const renderFormSection = (section) => {
    const { register, formState: { errors } } = formMethods;
    
    return (
      <div key={section.id} className="bg-white shadow sm:rounded-lg p-6 mb-8">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            {section.icon}
            {section.title}
          </h3>
        </div>
        <div className="grid grid-cols-6 gap-6">
          {section.fields.map((field) => {
            const { name, label, type, required, options, placeholder, disabled, ...rest } = field;
            const error = errors[name];
            const fieldClasses = `mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              error ? 'border-red-500' : 'border-gray-300'
            } ${disabled ? 'bg-gray-100' : ''}`;
            
            return (
              <div key={name} className={field.colSpan || 'col-span-6'}>
                <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                
                {type === 'select' ? (
                  <select
                    id={name}
                    className={fieldClasses}
                    disabled={disabled}
                    {...register(name)}
                    {...rest}
                  >
                    <option value="">Select {label}</option>
                    {options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : type === 'textarea' ? (
                  <textarea
                    id={name}
                    rows={3}
                    className={fieldClasses}
                    disabled={disabled}
                    placeholder={placeholder}
                    {...register(name)}
                    {...rest}
                  />
                ) : (
                  <input
                    id={name}
                    type={type}
                    className={fieldClasses}
                    disabled={disabled}
                    placeholder={placeholder}
                    {...register(name)}
                    {...rest}
                  />
                )}
                
                {error && (
                  <p className="mt-1 text-sm text-red-600">{error.message}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render form container
  const renderForm = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {formSections.map(renderFormSection)}
      
      {/* Document Upload Section */}
      {renderDocumentUploads()}
      
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <FiRefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Submitting...
            </>
          ) : (
            'Submit Application'
          )}
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Application Number */}
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Application Number</h3>
              <p className="text-sm text-gray-500">
                {applicationId || 'Will be generated after submission'}
              </p>
            </div>
            <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-800">
              {applicationId ? 'Submitted' : 'Draft'}
            </div>
          </div>
        </div>

        {/* School Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-md overflow-hidden">
          <div className="p-4 text-white">
            <h1 className="text-xl font-bold mb-1">
              {schoolInfo.fullName}
            </h1>
            <div className="text-blue-100 text-sm space-y-1">
              <p>{schoolInfo.address.fullAddress}</p>
              <p>Run By: {schoolInfo.runBy} • Reg: {schoolInfo.registration.number}</p>
            </div>
          </div>
        </div>

        {/* Admission Test Card */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-md overflow-hidden">
          <div className="p-4 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold">Admission Test Application</h2>
                <p className="text-green-100 text-sm">Session 2026-27</p>
              </div>
              <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                Form No: {applicationId || 'New'}
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Student Admission Form
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Please fill in all the required fields marked with an asterisk (*).
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            {renderForm()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyForm;
