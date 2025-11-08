import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Icons
import { FileText, Image as ImageIcon, Plus } from 'lucide-react';

// Custom Icons
const NoticeIcon = () => (
  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const PhotoIcon = () => (
  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Mock data - in a real app, this would come from an API
  const [counts, setCounts] = useState({
    notices: 24,      // Replace with actual data
    photos: 156       // Replace with actual data
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {currentUser?.displayName || 'Admin'}</p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notice Manager Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-50 mr-4">
                  <NoticeIcon />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Notice Manager</h2>
              </div>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {counts.notices} {counts.notices === 1 ? 'Notice' : 'Notices'}
              </span>
            </div>
            <p className="text-gray-600 mb-6">Manage school notices, announcements, and circulars</p>
            <div className="flex space-x-3">
              <button 
                onClick={() => navigate('/admin/notices')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <FileText className="w-4 h-4 mr-2" />
                View Notices
              </button>
              <button 
                onClick={() => navigate('/admin/notices/new')}
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New
              </button>
            </div>
          </div>
        </div>

        {/* Photo Manager Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-50 mr-4">
                  <PhotoIcon />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Photo Gallery</h2>
              </div>
              <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {counts.photos} {counts.photos === 1 ? 'Photo' : 'Photos'}
              </span>
            </div>
            <p className="text-gray-600 mb-6">Manage school photos, events, and gallery</p>
            <div className="flex space-x-3">
              <button 
                onClick={() => navigate('/admin/gallery')}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                View Gallery
              </button>
              <button 
                onClick={() => navigate('/admin/gallery/upload')}
                className="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Upload Photos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
