import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAdmissionAuth } from '../../hooks/useAdmissionAuth';
import { db, auth } from '../../firebase';
import { doc, getDoc, query, collection, where, getDocs, addDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { 
  FiUser, 
  FiMapPin, 
  FiBook, 
  FiCamera, 
  FiFile,
  FiUpload,
  FiChevronLeft,
  FiMail,
  FiPhone,
  FiRefreshCw
} from 'react-icons/fi';
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
  lastClass: yup.string().required('Last class attended is required'),
  
  // Documents
  photo: yup.mixed().test('file', 'Student photo is required', (value) => {
    return value && (value instanceof File || typeof value === 'string');
  }),
  birthCertificate: yup.mixed().test('file', 'Birth certificate is required', (value) => {
    return value && (value instanceof File || typeof value === 'string');
  }),
});

const EditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError] = useState('');
  const [birthCertPreview, setBirthCertPreview] = useState(null);
  const [birthCertError, setBirthCertError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [existingApplication, setExistingApplication] = useState(null);
  
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
      lastClass: '',
      
      // Documents
      photo: null,
      birthCertificate: null
    }
  });

  // Get current user
  const { user } = useAuth();

  // Load application data
  useEffect(() => {
    const loadApplication = async () => {
      console.log('[EDIT FORM] Loading application with ID:', id);
      
      if (!id || !user) {
        console.error('[EDIT FORM] Missing ID or user not authenticated');
        toast.error('Invalid request');
        navigate('/admission');
        return;
      }

      try {
        setLoading(true);
        console.log('[EDIT FORM] Fetching application from Firestore...');
        
        console.log('[DEBUG] Trying to find application with ID:', id);
        let appSnap = null;
        
        // First try to find by document ID
        const docRef = doc(db, 'applications', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          console.log('[DEBUG] Found application by document ID:', docSnap.id);
          appSnap = {
            id: docSnap.id,
            exists: () => true,
            data: () => docSnap.data()
          };
        } else {
          console.log('[DEBUG] No document found with ID, trying applicationId field...');
          
          try {
            // Try to find by applicationNumber field
            console.log('[DEBUG] Searching for application with number:', id);
            
            // First try exact match
            let q = query(
              collection(db, 'applications'),
              where('applicationNumber', '==', id)
            );
            
            let querySnapshot = await getDocs(q);
            console.log('[DEBUG] Exact query by applicationNumber found', querySnapshot.size, 'documents');
            
            // If no exact match, try removing any special characters
            if (querySnapshot.empty) {
              const cleanId = id.replace(/[^a-zA-Z0-9]/g, '');
              console.log('[DEBUG] Trying cleaned application number:', cleanId);
              
              q = query(
                collection(db, 'applications'),
                where('applicationNumber', '>=', cleanId),
                where('applicationNumber', '<=', cleanId + '\uf8ff')
              );
              
              querySnapshot = await getDocs(q);
              console.log('[DEBUG] Fuzzy query by applicationNumber found', querySnapshot.size, 'documents');
            }
            
            if (!querySnapshot.empty) {
              const doc = querySnapshot.docs[0];
              appSnap = {
                id: doc.id,
                exists: () => true,
                data: () => doc.data()
              };
              console.log('[EDIT FORM] Found application by applicationId field:', doc.id);
            }
          } catch (queryError) {
            console.error('[DEBUG] Error querying by applicationId:', queryError);
          }
        }
        
        if (appSnap?.exists?.()) {
          const appData = appSnap.data();
          console.log('[EDIT FORM] Application found:', appData);
          
          // Verify the user has permission to edit this application
          if (appData.userId !== user.uid) {
            console.error('[EDIT FORM] Permission denied - user ID mismatch', {
              appUserId: appData.userId,
              currentUserId: user.uid
            });
            toast.error('You do not have permission to edit this application');
            navigate('/admission');
            return;
          }
          
          // Check if application is locked
          if (appData.locked) {
            console.log('[EDIT FORM] Application is locked');
            toast.error('This application is currently locked and cannot be edited. Please contact the administrator.');
            setIsLocked(true);
          }
          
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
          
          setExistingApplication(appData);
        } else {
          console.error('[EDIT FORM] Application not found in Firestore', {
            searchedId: id,
            userId: user?.uid,
            timestamp: new Date().toISOString()
          });
          toast.error(`Application not found. Please check the application ID and try again.`, {
            duration: 5000
          });
          setTimeout(() => {
            navigate('/admission');
          }, 2000);
        }
      } catch (error) {
        console.error('[EDIT FORM] Error loading application:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          stack: error.stack
        });
        
        // More specific error messages
        if (error.code === 'permission-denied') {
          toast.error('You do not have permission to view this application');
        } else if (error.code === 'not-found') {
          toast.error('Application not found. It may have been deleted or moved.');
        } else {
          toast.error('Failed to load application. Please try again later.');
        }
        
        // Redirect after a short delay to allow toast to be seen
        setTimeout(() => {
          navigate('/admission');
        }, 1000);
      } finally {
        setLoading(false);
      }
    };

    loadApplication();
  }, [id, user, formMethods, navigate]);

  // Handle form submission
  const onSubmit = async (data) => {
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
        return;
      }

      // Validate birth certificate
      if (!data.birthCertificate) {
        toast.error('Please upload a birth certificate');
        return;
      }

      // Convert photo to base64 if it's a file
      let photoBase64 = photoPreview;
      if (data.photo && data.photo[0] && !photoPreview.startsWith('data:image')) {
        photoBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(data.photo[0]);
        });
      } 
      
      if (!photoBase64) {
        setPhotoError('Failed to process photo. Please try again.');
        return;
      }

      // Convert birth certificate to base64 if it's a file
      let birthCertBase64 = data.birthCertificate;
      if (data.birthCertificate && data.birthCertificate[0]) {
        birthCertBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(data.birthCertificate[0]);
        });
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
        photo: photoBase64,
        birthCertificate: birthCertBase64,
        
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
        status: existingApplication?.status || 'pending',
        locked: existingApplication?.locked || false,
        updatedAt: serverTimestamp(),
        userId: user.uid,
      };

      // Update existing application
      await setDoc(doc(db, 'applications', id), applicationData, { merge: true });
      
      toast.success('Application updated successfully!');
      setShowSuccess(true);
      
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        { name: 'fatherName', label: "Father's Name", type: 'text', required: true, colSpan: 'col-span-6 sm:col-span-3' },
        { name: 'motherName', label: "Mother's Name", type: 'text', required: true, colSpan: 'col-span-6 sm:col-span-3' },
        { 
          name: 'parentPhone', 
          label: "Parent's Mobile Number", 
          type: 'tel', 
          required: true,
          placeholder: '10-digit mobile number',
          colSpan: 'col-span-6 sm:col-span-3'
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
          required: true,
          colSpan: 'col-span-6 sm:col-span-3'
        },
        { 
          name: 'previousSchool', 
          label: 'Previous School Name', 
          type: 'text', 
          required: true,
          placeholder: 'Name of the last attended school',
          colSpan: 'col-span-6 sm:col-span-3'
        },
        { 
          name: 'lastClass', 
          label: 'Last Class Attended', 
          type: 'select',
          options: schoolInfo.classes.filter(c => c !== 'Nursery' && c !== 'LKG'),
          required: true,
          colSpan: 'col-span-6 sm:col-span-3'
        },
      ]
    }
  ];

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application form...</p>
        </div>
      </div>
    );
  }

  // Render form field
  const renderField = (field) => {
    const { register, formState: { errors } } = formMethods;
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
            disabled={disabled || isLocked}
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
            disabled={disabled || isLocked}
            placeholder={placeholder}
            {...register(name)}
            {...rest}
          />
        ) : (
          <input
            id={name}
            type={type}
            className={fieldClasses}
            disabled={disabled || isLocked}
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
  };

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
            disabled={isLocked}
          >
            <FiCamera className="h-5 w-5 text-gray-600" />
            <input
              id="photo-upload"
              name="photo"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                if (isLocked) return;
                const file = e.target.files[0];
                if (!file) return;
                
                const error = validatePhoto(file);
                if (error) {
                  setPhotoError(error);
                  return;
                }
                
                const reader = new FileReader();
                reader.onload = (event) => {
                  setPhotoPreview(event.target.result);
                  formMethods.setValue('photo', file);
                };
                reader.readAsDataURL(file);
                setPhotoError('');
              }}
              disabled={isLocked}
            />
          </label>
        </div>
        <div className="ml-4">
          <button
            type="button"
            onClick={() => document.getElementById('photo-upload').click()}
            className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={isLocked}
          >
            Choose Photo
          </button>
          <p className="mt-1 text-xs text-gray-500">
            JPG, PNG (max 200KB, 500x500px)
          </p>
          {photoError && (
            <p className="mt-1 text-sm text-red-600">{photoError}</p>
          )}
          {formMethods.formState.errors.photo && (
            <p className="mt-1 text-sm text-red-600">{formMethods.formState.errors.photo.message}</p>
          )}
        </div>
      </div>
    </div>
  );

  // Render birth certificate upload field
  const renderBirthCertField = () => (
    <div className="mb-6">
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
            disabled={isLocked}
          >
            <FiUpload className="h-4 w-4 text-gray-600" />
            <input
              id="birth-cert-upload"
              name="birthCertificate"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="sr-only"
              onChange={(e) => {
                if (isLocked) return;
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
                
                formMethods.setValue('birthCertificate', file);
                setBirthCertError('');
              }}
              disabled={isLocked}
            />
          </label>
        </div>
        <div className="ml-4">
          <button
            type="button"
            onClick={() => document.getElementById('birth-cert-upload').click()}
            className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={isLocked}
          >
            Choose File
          </button>
          <p className="mt-1 text-xs text-gray-500">
            PDF, JPG, PNG (max 5MB)
          </p>
          {birthCertError && (
            <p className="mt-1 text-sm text-red-600">{birthCertError}</p>
          )}
          {formMethods.formState.errors.birthCertificate && (
            <p className="mt-1 text-sm text-red-600">
              {formMethods.formState.errors.birthCertificate.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  // Render document uploads section
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

  // Render form section
  const renderFormSection = (section) => (
    <div key={section.id} className="bg-white shadow sm:rounded-lg p-6 mb-8">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          {section.icon}
          {section.title}
        </h3>
      </div>
      <div className="grid grid-cols-6 gap-6">
        {section.fields.map((field) => renderField(field))}
      </div>
    </div>
  );

  // Render success message
  const renderSuccess = () => (
    <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-green-700">
            Application updated successfully!
          </p>
        </div>
      </div>
    </div>
  );

  // Render form container
  const renderForm = () => (
    <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-8">
      {showSuccess && renderSuccess()}
      
      {formSections.map(renderFormSection)}
      
      {/* Document Upload Section */}
      {renderDocumentUploads()}
      
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || isLocked}
          className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <FiRefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Updating...
            </>
          ) : (
            'Update Application'
          )}
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Edit Application</h1>
          <p className="mt-2 text-sm text-gray-600">
            Update your application details below.
          </p>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Application ID: {id}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Please review and update your application details.
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

export default EditForm;
