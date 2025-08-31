import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  Timestamp,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiEye, FiEyeOff, FiChevronDown, FiChevronUp, FiPlus } from 'react-icons/fi';

// Notice categories
const NOTICE_CATEGORIES = [
  'General',
  'Academics',
  'Events',
  'Exams',
  'Holidays',
  'Sports',
  'Admissions',
  'Others'
];

const NoticesManager = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    content: '',
    category: 'General',
    isActive: true,
    important: false,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    createdAt: null,
    updatedAt: null
  });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef(null);

  // Fetch notices with memoization
  const fetchNotices = useCallback(async () => {
    try {
      setLoading(true);
      let q;
      if (selectedCategory === 'All') {
        q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
      } else {
        q = query(
          collection(db, 'notices'),
          where('category', '==', selectedCategory),
          orderBy('createdAt', 'desc')
        );
      }
      const querySnapshot = await getDocs(q);
      const noticesList = [];
      querySnapshot.forEach((doc) => {
        noticesList.push({ id: doc.id, ...doc.data() });
      });
      setNotices(noticesList);
      return noticesList;
    } catch (error) {
      console.error('Error fetching notices:', error);
      toast.error('Failed to load notices');
      return [];
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = useCallback(() => {
    setFormData({
      id: null,
      title: '',
      content: '',
      category: 'General',
      isActive: true,
      important: false,
      startDate: new Date().toISOString().split('T')[0],
      endDate: ''
    });
    setIsEditing(false);
    setShowForm(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.title || !formData.content || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Date validation
    if (formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      toast.error('End date cannot be before start date');
      return;
    }

    setIsSubmitting(true);
    try {
      const noticeData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        isActive: formData.isActive,
        important: formData.important,
        startDate: formData.startDate ? Timestamp.fromDate(new Date(formData.startDate)) : null,
        endDate: formData.endDate ? Timestamp.fromDate(new Date(formData.endDate)) : null,
        updatedAt: serverTimestamp()
      };

      if (isEditing) {
        await updateDoc(doc(db, 'notices', formData.id), noticeData);
        toast.success('Notice updated successfully');
      } else {
        await addDoc(collection(db, 'notices'), {
          ...noticeData,
          createdAt: serverTimestamp(),
          isActive: true // Default to active when creating
        });
        toast.success('Notice added successfully');
      }

      await fetchNotices();
      resetForm();
    } catch (error) {
      console.error('Error saving notice:', error);
      toast.error(`Failed to ${isEditing ? 'update' : 'add'} notice: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (notice) => {
    setFormData({
      id: notice.id,
      title: notice.title,
      content: notice.content,
      category: notice.category || 'General',
      isActive: notice.isActive ?? true,
      important: notice.important || false,
      startDate: notice.startDate?.toDate().toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
      endDate: notice.endDate?.toDate().toISOString().split('T')[0] || '',
      createdAt: notice.createdAt,
      updatedAt: notice.updatedAt
    });
    setIsEditing(true);
    setShowForm(true);
    // Scroll to form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await deleteDoc(doc(db, 'notices', id));
        toast.success('Notice deleted successfully');
        await fetchNotices();
      } catch (error) {
        console.error('Error deleting notice:', error);
        toast.error('Failed to delete notice');
      }
    }
  };

  const toggleStatus = async (notice) => {
    try {
      await updateDoc(doc(db, 'notices', notice.id), {
        isActive: !notice.isActive,
        updatedAt: serverTimestamp()
      });
      toast.success(`Notice ${notice.isActive ? 'deactivated' : 'activated'}`);
      await fetchNotices();
    } catch (error) {
      console.error('Error updating notice status:', error);
      toast.error('Failed to update notice status');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return 'N/A';
    return new Date(timestamp.toDate()).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notice Management</h2>
          <p className="mt-1 text-sm text-gray-500">
            {isEditing ? 'Edit Notice' : 'Create and manage school notices'}
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="All">All Categories</option>
              {NOTICE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
              showForm ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {showForm ? (
              <>
                <FiChevronUp className="-ml-1 mr-2 h-5 w-5" />
                Hide Form
              </>
            ) : (
              <>
                <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                New Notice
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notice Form */}
      {showForm && (
        <div ref={formRef} className="bg-white shadow rounded-lg overflow-hidden mb-8 transition-all duration-200">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {isEditing ? 'Edit Notice' : 'Create New Notice'}
            </h3>
          </div>
          <div className="px-6 py-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter notice title"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="content"
                    id="content"
                    rows={4}
                    value={formData.content}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter notice content"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    id="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    {NOTICE_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <input
                        id="isActive"
                        name="isActive"
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData({ ...formData, isActive: e.target.checked })
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                        Active
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="important"
                        name="important"
                        type="checkbox"
                        checked={formData.important}
                        onChange={(e) =>
                          setFormData({ ...formData, important: e.target.checked })
                        }
                        className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded"
                      />
                      <label htmlFor="important" className="ml-2 block text-sm text-gray-700">
                        Important
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    id="endDate"
                    value={formData.endDate}
                    min={formData.startDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                    isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {isSubmitting ? 'Saving...' : isEditing ? 'Update Notice' : 'Create Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notices List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading notices...</div>
        ) : notices.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No notices found. {!showForm && 'Click "New Notice" to create one.'}
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {notices.map((notice) => (
              <li key={notice.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-blue-600 truncate">
                        {notice.title}
                      </p>
                      {notice.important && (
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Important
                        </span>
                      )}
                      {!notice.isActive && (
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {notice.content}
                    </p>
                    <div className="mt-1 text-xs text-gray-500">
                      <span>Category: {notice.category}</span>
                      <span className="mx-2">•</span>
                      <span>Posted: {formatDate(notice.createdAt)}</span>
                      {notice.endDate && (
                        <>
                          <span className="mx-2">•</span>
                          <span>Ends: {formatDate(notice.endDate)}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex space-x-2">
                    <button
                      onClick={() => handleEdit(notice)}
                      className="p-1.5 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                      title="Edit"
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(notice.id)}
                      className="p-1.5 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50"
                      title="Delete"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => toggleStatus(notice)}
                      className="p-1.5 rounded-full text-gray-400 hover:text-green-600 hover:bg-green-50"
                      title={notice.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {notice.isActive ? (
                        <FiEyeOff className="h-4 w-4" />
                      ) : (
                        <FiEye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NoticesManager;
