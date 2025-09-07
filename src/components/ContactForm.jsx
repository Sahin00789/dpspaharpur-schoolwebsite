import { useState, useEffect } from 'react';
import { FiSend, FiUser, FiMail, FiMessageSquare, FiCamera, FiX, FiPhone } from 'react-icons/fi';
import { db, storage } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const ContactForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    phone: '',
    photo: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState('');
  // Pre-fill user data when component mounts or user changes
  useEffect(() => {
    const getUserPhoto = async () => {
      if (user) {
        // Get the current user from Firebase Auth
        const currentUser = user;
        let photoUrl = '';
        
        // Try different possible photo URL properties
        if (currentUser.photoURL) {
          photoUrl = currentUser.photoURL;
        } else if (currentUser.providerData && currentUser.providerData[0]?.photoURL) {
          photoUrl = currentUser.providerData[0].photoURL;
        } else if (currentUser.photo) {
          photoUrl = currentUser.photo;
        }
        
        // Update form data with user info
        setFormData(prev => ({
          ...prev,
          name: currentUser.displayName || '',
          email: currentUser.email || '',
          phone: currentUser.phoneNumber || '',
          photo: photoUrl || null
        }));
        
        // Set the preview if we have a photo URL
        if (photoUrl) {
          // Add timestamp to prevent caching issues
          const timestamp = new Date().getTime();
          const urlWithTimestamp = photoUrl.includes('?') 
            ? `${photoUrl}&t=${timestamp}`
            : `${photoUrl}?t=${timestamp}`;
          setPreview(urlWithTimestamp);
        } else {
          setPreview('');
        }
      } else {
        // Reset form for non-logged in users
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          photo: null
        });
        setPreview('');
      }
    };
    
    getUserPhoto();
  }, [user]);


  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setFormData(prev => ({
          ...prev,
          photo: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPreview('');
    setFormData(prev => ({
      ...prev,
      photo: null
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      // Upload photo if exists
      let photoUrl = '';
      if (formData.photo) {
        if (typeof formData.photo === 'string') {
          // If it's a URL (from user.photoURL), use it directly
          photoUrl = formData.photo;
        } else {
          // Upload new photo to Firebase Storage
          const storageRef = ref(storage, `contact_photos/${Date.now()}_${formData.photo.name}`);
          await uploadBytes(storageRef, formData.photo);
          photoUrl = await getDownloadURL(storageRef);
        }
      }
      
      // Prepare message data with server-side timestamp
      const messageData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        phone: formData.phone?.trim() || '',
        photoUrl,
        status: 'unread',
        userId: user?.uid || 'anonymous',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ip: await fetch('https://api.ipify.org?format=json')
          .then(res => res.json())
          .then(data => data.ip)
          .catch(() => 'unknown')
      };
      
      
      // Try to add the message directly
      const docRef = await addDoc(collection(db, 'messages'), messageData);
      console.log('Message sent with ID:', docRef.id);
      
      toast.success('Message sent successfully! We will get back to you soon!');
      setFormData({ name: '', email: '', message: '', phone: '' });
    } catch (error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      
      let errorMessage = 'Failed to send message. Please try again.';
      if (error.code === 'permission-denied') {
        errorMessage = 'Permission denied. Please make sure you are logged in.';
      } else if (error.code === 'unauthenticated') {
        errorMessage = 'Please sign in to send messages.';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Test Firestore connection
  const testFirestore = async () => {
    try {
      console.log('Testing Firestore connection...');
      const testRef = collection(db, 'test_collection');
      const snapshot = await getDocs(testRef);
      console.log('Firestore test successful, documents:', snapshot.docs.map(d => d.data()));
      return true;
    } catch (error) {
      console.error('Firestore test failed:', error);
      return false;
    }
  };

  // Run test when component mounts
  useEffect(() => {
    testFirestore();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Send us a Message</h2>
        
        {/* User Info Header */}
        <div className="flex items-center space-x-4 mb-6 pb-4 border-b border-gray-200">
          <div className="h-16 w-16 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 relative">
            {preview ? (
              <>
                <img 
                  src={preview}
                  alt="Profile"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    // Fallback to user icon if image fails to load
                    e.target.style.display = 'none';
                    const fallback = e.target.nextElementSibling;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 hidden" style={{ display: 'none' }}>
                  <FiUser className="h-8 w-8" />
                </div>
              </>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400">
                <FiUser className="h-8 w-8" />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">{formData.name || 'Guest User'}</h3>
            <p className="text-sm text-gray-500">{formData.email || 'guest@example.com'}</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiPhone className="h-5 w-5 text-gray-400" />
              </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="+91 1234567890"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Your Message <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3">
                  <FiMessageSquare className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="How can we help you?"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FiSend className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default ContactForm;
