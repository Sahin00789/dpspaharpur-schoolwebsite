import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { auth, db, storage, signInWithGoogle, signOutUser, onAuthStateChanged } from '../firebase';
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { FiUpload, FiTrash2, FiExternalLink, FiFileText, FiImage, FiLink } from 'react-icons/fi';

const DOC_CATEGORIES = ['notice', 'syllabus'];
const MEDIA_CATEGORIES = ['gallery', 'slider'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('documents');
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      toast.success('Successfully logged out');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Failed to log out');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast.success('Successfully signed in with Google');
    } catch (error) {
      toast.error(error.message || 'Failed to sign in with Google');
    }
  };

  return (
    <section className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {currentUser.displayName || currentUser.email}
              </span>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={handleGoogleSignIn}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in with Google
            </button>
          )}
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('documents')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'documents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Documents
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'media'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Media Library
            </button>
            <button
              onClick={() => setActiveTab('links')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'links'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Quick Links
            </button>
          </nav>
        </div>

        {/* Tab Panels */}
        <div className="mt-6">
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Upload Documents</h3>
                  <p className="mt-1 text-sm text-gray-500">Upload notices, syllabus, or other documents</p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <UploadPdfCard />
                </div>
              </div>

              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Manage Documents</h3>
                  <p className="mt-1 text-sm text-gray-500">View and manage uploaded documents</p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <DocumentsTable />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-6">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Upload Media</h3>
                  <p className="mt-1 text-sm text-gray-500">Upload images for gallery or slider</p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <UploadMediaCard />
                </div>
              </div>

              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Media Library</h3>
                  <p className="mt-1 text-sm text-gray-500">View and manage uploaded media</p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <MediaTable />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'links' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Links</h3>
                <p className="mt-1 text-sm text-gray-500">Update important website links</p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <RedirectLinksCard />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function RedirectLinksCard(){
  const [links, setLinks] = useState({
    admissionUrl: '',
    resultUrl: '',
    prospectusUrl: '',
    academicCalendarUrl: ''
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const snap = await getDoc(doc(db, 'config', 'links'));
        if (snap.exists()) {
          const data = snap.data();
          setLinks({
            admissionUrl: data.admissionUrl || '',
            resultUrl: data.resultUrl || '',
            prospectusUrl: data.prospectusUrl || '',
            academicCalendarUrl: data.academicCalendarUrl || ''
          });
        }
      } catch (error) {
        console.error('Error fetching links:', error);
        setMsg({ type: 'error', text: 'Failed to load links' });
      }
    };
    
    fetchLinks();
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLinks(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: '', text: '' });
    
    try {
      await setDoc(doc(db, 'config', 'links'), links, { merge: true });
      setMsg({ type: 'success', text: 'Links updated successfully!' });
      toast.success('Links updated successfully!');
    } catch (error) {
      console.error('Error updating links:', error);
      setMsg({ type: 'error', text: 'Failed to update links' });
      toast.error('Failed to update links');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {msg.text && (
        <div className={`p-4 rounded-md ${msg.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {msg.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="admissionUrl" className="block text-sm font-medium text-gray-700">
            Admission Form URL
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              <FiLink className="h-4 w-4" />
            </span>
            <input
              type="url"
              name="admissionUrl"
              id="admissionUrl"
              value={links.admissionUrl}
              onChange={handleInputChange}
              className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
              placeholder="https://example.com/admission"
            />
          </div>
        </div>

        <div>
          <label htmlFor="resultUrl" className="block text-sm font-medium text-gray-700">
            Results Portal URL
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              <FiLink className="h-4 w-4" />
            </span>
            <input
              type="url"
              name="resultUrl"
              id="resultUrl"
              value={links.resultUrl}
              onChange={handleInputChange}
              className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
              placeholder="https://example.com/results"
            />
          </div>
        </div>

        <div>
          <label htmlFor="prospectusUrl" className="block text-sm font-medium text-gray-700">
            Prospectus Download URL
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              <FiFileText className="h-4 w-4" />
            </span>
            <input
              type="url"
              name="prospectusUrl"
              id="prospectusUrl"
              value={links.prospectusUrl}
              onChange={handleInputChange}
              className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
              placeholder="https://example.com/prospectus.pdf"
            />
          </div>
        </div>

        <div>
          <label htmlFor="academicCalendarUrl" className="block text-sm font-medium text-gray-700">
            Academic Calendar URL
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              <FiCalendar className="h-4 w-4" />
            </span>
            <input
              type="url"
              name="academicCalendarUrl"
              id="academicCalendarUrl"
              value={links.academicCalendarUrl}
              onChange={handleInputChange}
              className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
              placeholder="https://example.com/calendar.pdf"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : 'Save Changes'}
          </button>
        </div>
        {formData.fileName && (
          <p className="text-gray-600">Selected file: {formData.fileName}</p>
        )}
        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSubmit}
        >
          {uploading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Uploading...
            </>
          ) : (
            'Upload Document'
          )}
        </button>
        {message.text && (
          <div
            className={`p-4 rounded-md ${
              message.type === 'error'
                ? 'bg-red-50 text-red-700'
                : 'bg-green-50 text-green-700'
            }`}
          >
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
}

function DocumentsTable() {
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async ()=>{
    setLoading(true)
    const q = query(collection(db,'documents'), orderBy('createdAt','desc'))
    const snap = await getDocs(q)
    const arr = snap.docs.map(d=> ({ id:d.id, ...d.data() }))
    setDocs(arr)
    setLoading(false)
  }

  useEffect(()=>{ load() },[])

  const remove = async (d)=>{
    if(d.path){
      try{ await deleteObject(ref(storage, d.path)) }catch(e){}
    }
    await deleteDoc(doc(db,'documents', d.id))
    await load()
  }

  return (
    <div className='bg-white rounded-xl shadow p-5'>
      <div className='flex items-center justify-between mb-3'>
        <h2 className='text-xl font-semibold'>Documents</h2>
        <button onClick={load} className='px-3 py-1 rounded bg-slate-200'>Refresh</button>
      </div>
      {loading? <div>Loading...</div> : (
        <div className='overflow-auto'>
          <table className='min-w-full text-left'>
            <thead>
              <tr className='border-b'>
                <th className='p-2'>Title</th>
                <th className='p-2'>Category</th>
                <th className='p-2'>Link</th>
                <th className='p-2'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {docs.map(d=> (
                <tr key={d.id} className='border-b'>
                  <td className='p-2'>{d.title}</td>
                  <td className='p-2'>{d.category}</td>
                  <td className='p-2'><a className='text-blue-600 underline' href={d.url} target='_blank' rel='noreferrer'>Open</a></td>
                  <td className='p-2'><button className='text-red-600' onClick={()=>remove(d)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function UploadPdfCard() {
  const [formData, setFormData] = useState({
    title: '',
    category: 'notice',
    description: '',
    file: null,
    fileName: ''
  });
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = React.useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));  
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type (PDF, DOC, DOCX)
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        setMessage({ type: 'error', text: 'Please upload a valid document (PDF, DOC, or DOCX)' });
        return;
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File size should be less than 10MB' });
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        file,
        fileName: file.name,
        title: prev.title || file.name.replace(/\.[^/.]+$/, '') // Use filename as title if title is empty
      }));
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.file) {
      setMessage({ type: 'error', text: 'Please fill all required fields' });
      return;
    }
    
    setUploading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Upload file to storage
      const storagePath = `documents/${formData.category}/${Date.now()}_${formData.fileName}`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, formData.file);
      const fileUrl = await getDownloadURL(storageRef);
      
      // Save to Firestore
      await addDoc(collection(db, 'documents'), {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        url: fileUrl,
        fileName: formData.fileName,
        fileType: formData.file.type,
        fileSize: formData.file.size,
        storagePath,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Reset form
      setFormData({
        title: '',
        category: 'notice',
        description: '',
        file: null,
        fileName: ''
      });
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      setMessage({ type: 'success', text: 'Document uploaded successfully!' });
      toast.success('Document uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ type: 'error', text: 'Failed to upload document. Please try again.' });
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange({ target: { files: [file] } });
    }
  };

  return (
    <div className='bg-white rounded-xl shadow p-5'>
      <h2 className='text-xl font-semibold mb-3'>Upload PDF Document</h2>
      <form onSubmit={handleSubmit}>
        <div className='space-y-3'>
          <input 
            className='border p-2 rounded w-full' 
            placeholder='Title' 
            name='title' 
            value={formData.title} 
            onChange={handleInputChange} 
          />
          <select 
            className='border p-2 rounded w-full' 
            name='category' 
            value={formData.category} 
            onChange={handleInputChange}
          >
            <option value='notice'>Notice</option>
            <option value='circular'>Circular</option>
            <option value='other'>Other</option>
          </select>
          <textarea 
            className='border p-2 rounded w-full' 
            placeholder='Description' 
            name='description' 
            value={formData.description} 
            onChange={handleInputChange} 
          />
          <input 
            type='file' 
            accept='application/pdf' 
            ref={fileInputRef} 
            onChange={handleFileChange} 
          />
          <button 
            disabled={uploading} 
            className='bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60' 
            type='submit'
          >
            {uploading? 'Uploading...' : 'Upload Document'}
          </button>
          {message.text && (
            <div
              className={`p-4 rounded-md ${
                message.type === 'error'
                  ? 'bg-red-50 text-red-700'
                  : 'bg-green-50 text-green-700'
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      </form>
    </div>
  )
}

function UploadMediaCard() {
  const [formData, setFormData] = useState({
    title: '',
    type: 'photo', // 'photo' or 'video'
    description: '',
    file: null,
    fileName: '',
    mediaUrl: ''
  });
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = React.useRef(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type based on media type
      const photoTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const videoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
      
      const isValidType = formData.type === 'photo' 
        ? photoTypes.includes(file.type)
        : videoTypes.includes(file.type);
      
      if (!isValidType) {
        const allowedTypes = formData.type === 'photo' 
          ? 'JPG, PNG, GIF, or WebP' 
          : 'MP4, WebM, or QuickTime';
        setMessage({ type: 'error', text: `Please upload a valid ${formData.type} file (${allowedTypes})` });
        return;
      }
      
      // Check file size (10MB for photos, 50MB for videos)
      const maxSize = formData.type === 'photo' ? 10 * 1024 * 1024 : 50 * 1024 * 1024;
      if (file.size > maxSize) {
        setMessage({ 
          type: 'error', 
          text: `File size should be less than ${formData.type === 'photo' ? '10MB' : '50MB'}` 
        });
        return;
      }
      
      // Create preview URL
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
      
      setFormData(prev => ({
        ...prev,
        file,
        fileName: file.name,
        title: prev.title || file.name.replace(/\.[^/.]+$/, '') // Use filename as title if title is empty
      }));
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.file) {
      setMessage({ type: 'error', text: 'Please fill all required fields' });
      return;
    }
    
    setUploading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Upload file to storage
      const storagePath = `media/${formData.type}s/${Date.now()}_${formData.fileName}`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, formData.file);
      const fileUrl = await getDownloadURL(storageRef);
      
      // Save to Firestore
      await addDoc(collection(db, 'media'), {
        title: formData.title,
        type: formData.type,
        description: formData.description,
        url: fileUrl,
        thumbnailUrl: formData.type === 'video' ? await generateVideoThumbnail(formData.file) : fileUrl,
        fileName: formData.fileName,
        fileType: formData.file.type,
        fileSize: formData.file.size,
        storagePath,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Reset form
      setFormData({
        title: '',
        type: 'photo',
        description: '',
        file: null,
        fileName: '',
        mediaUrl: ''
      });
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      setPreviewUrl('');
      setMessage({ type: 'success', text: 'Media uploaded successfully!' });
      toast.success('Media uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ type: 'error', text: 'Failed to upload media. Please try again.' });
      toast.error('Failed to upload media');
    } finally {
      setUploading(false);
    }
  };
  
  // Clean up preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange({ target: { files: [file] } });
    }
  };
  
  // Helper function to generate video thumbnail
  const generateVideoThumbnail = (videoFile) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      
      video.src = URL.createObjectURL(videoFile);
      video.addEventListener('loadeddata', () => {
        // Set canvas size to video dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw video frame to canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL
        const thumbnailUrl = canvas.toDataURL('image/jpeg');
        resolve(thumbnailUrl);
      });
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Upload Media</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Media Type Toggle */}
        <div className="flex space-x-4 mb-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="type"
              value="photo"
              checked={formData.type === 'photo'}
              onChange={handleInputChange}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span className="ml-2">Photo</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="type"
              value="video"
              checked={formData.type === 'video'}
              onChange={handleInputChange}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span className="ml-2">Video</span>
          </label>
        </div>
        
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter media title"
            required
          />
        </div>
        
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter a description (optional)"
          />
        </div>
        
        {/* File Upload */}
        <div 
          className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md ${
            !formData.file ? 'hover:border-blue-500' : ''
          }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="space-y-1 text-center">
            {previewUrl ? (
              formData.type === 'photo' ? (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="mx-auto max-h-48 rounded-md object-cover"
                />
              ) : (
                <video 
                  src={previewUrl} 
                  controls 
                  className="mx-auto max-h-48 rounded-md"
                />
              )
            ) : (
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
              >
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                  accept={formData.type === 'photo' ? 'image/*' : 'video/*'}
                  ref={fileInputRef}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">
              {formData.type === 'photo' 
                ? 'PNG, JPG, GIF up to 10MB' 
                : 'MP4, WebM, QuickTime up to 50MB'}
            </p>
          </div>
        </div>
        
        {/* Selected File Info */}
        {formData.file && (
          <div className="text-sm text-gray-700">
            <p>Selected file: {formData.fileName}</p>
            <p>Size: {(formData.file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        )}
        
        {/* Status Message */}
        {message.text && (
          <div className={`p-3 rounded-md ${
            message.type === 'error' 
              ? 'bg-red-50 text-red-700' 
              : 'bg-green-50 text-green-700'
          }`}>
            {message.text}
          </div>
        )}
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={uploading || !formData.file}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
              uploading || !formData.file
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {uploading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Uploading...
              </>
            ) : (
              'Upload Media'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function MediaTable() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'photo', 'video'
  const [searchQuery, setSearchQuery] = useState('');

  // Load media items
  const load = async () => {
    try {
      setLoading(true);
      let q = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
      
      if (filter !== 'all') {
        q = query(q, where('type', '==', filter));
      }
      
      const snap = await getDocs(q);
      const itemsData = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Format date for display
        formattedDate: doc.data().createdAt?.toDate().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }));
      
      // Filter by search query if provided
      const filteredItems = searchQuery 
        ? itemsData.filter(item => 
            item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : itemsData;
      
      setItems(filteredItems);
    } catch (error) {
      console.error('Error loading media:', error);
      toast.error('Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  // Delete media item
  const deleteItem = async (id, storagePath) => {
    if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return;
    }
    
    try {
      setDeletingId(id);
      
      // Delete file from storage if path exists
      if (storagePath) {
        const fileRef = ref(storage, storagePath);
        await deleteObject(fileRef);
      }
      
      // Delete document from Firestore
      await deleteDoc(doc(db, 'media', id));
      
      // Update local state
      setItems(prev => prev.filter(item => item.id !== id));
      toast.success('Media deleted successfully');
    } catch (error) {
      console.error('Error deleting media:', error);
      toast.error('Failed to delete media');
    } finally {
      setDeletingId(null);
    }
  };
  
  // Load items when component mounts or filter/search changes
  useEffect(() => {
    load();
  }, [filter, searchQuery]);

  // Clean up the effect
  useEffect(() => {
    return () => {
      // Cleanup if needed
    };
  }, []);

  // Format file size to human readable format
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading && items.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <h2 className="text-lg font-medium text-gray-900">Media Library</h2>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search media..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Media</option>
              <option value="photo">Photos</option>
              <option value="video">Videos</option>
            </select>
          </div>
        </div>
      </div>
      
      {items.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No media found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery
              ? 'Try adjusting your search or filter to find what you\'re looking for.'
              : 'Get started by uploading a new media file.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preview
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex-shrink-0 h-10 w-10">
                      {item.type === 'photo' ? (
                        <img 
                          className="h-10 w-10 rounded-md object-cover" 
                          src={item.thumbnailUrl || item.url} 
                          alt={item.title} 
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                          <svg className="h-6 w-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    {item.description && (
                      <div className="text-sm text-gray-500 line-clamp-1">{item.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.type === 'photo' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.type === 'photo' ? 'Photo' : 'Video'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.fileSize ? formatFileSize(item.fileSize) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.formattedDate || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900"
                        title="View"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </a>
                      <button
                        onClick={() => deleteItem(item.id, item.storagePath)}
                        disabled={deletingId === item.id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        title="Delete"
                      >
                        {deletingId === item.id ? (
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
