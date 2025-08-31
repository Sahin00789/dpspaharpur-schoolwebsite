import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Routes, Route, Link } from 'react-router-dom';
import { 
  FiLogOut, FiBell, FiHome, FiUsers, FiMessageSquare, 
  FiMenu, FiX, FiChevronRight, FiChevronLeft, 
  FiMail, FiUser, FiSettings, FiCalendar, FiPlus,
  FiArrowRight, FiAlertCircle
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { db } from '../../firebase';
import { 
  collection, getDocs, query, where, 
  orderBy, limit, onSnapshot 
} from 'firebase/firestore';
import NoticesManager from './NoticesManager';
import { useAuth } from '../../hooks/useAuth';

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State management
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [recentNotices, setRecentNotices] = useState([]);
  const [isLoadingNotices, setIsLoadingNotices] = useState(true);
  const [stats, setStats] = useState({
    activeNotices: { name: 'Active Notices', value: '0', icon: FiBell },
    unreadMessages: { name: 'Unread Messages', value: '0', icon: FiMail },
  });

  // Toggle sidebar
  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    localStorage.setItem('sidebarCollapsed', !newState);
  };

  // Load sidebar preference
  useEffect(() => {
    const savedPreference = localStorage.getItem('sidebarCollapsed');
    if (savedPreference !== null) {
      setIsSidebarOpen(savedPreference === 'false');
    }
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar && !sidebar.contains(event.target) && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const messagesRef = collection(db, 'messages');
        const messagesQuery = query(messagesRef, where('status', '==', 'unread'));
        const messagesSnapshot = await getDocs(messagesQuery);
        
        setStats(prev => ({
          ...prev,
          unreadMessages: { 
            ...prev.unreadMessages, 
            value: messagesSnapshot.size.toString() 
          }
        }));
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('Failed to load dashboard stats');
      }
    };

    fetchStats();
  }, []);

  // Real-time listener for unread messages
  useEffect(() => {
    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, where('status', '==', 'unread'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setStats(prev => ({
        ...prev,
        unreadMessages: { 
          ...prev.unreadMessages, 
          value: snapshot.size.toString() 
        }
      }));
    });
    
    return () => unsubscribe();
  }, []);

  // Fetch recent notices with retry logic
  useEffect(() => {
    let isMounted = true;
    const MAX_RETRIES = 3;
    let retryCount = 0;
    let retryTimeout;

    const fetchRecentNotices = async () => {
      try {
        setIsLoadingNotices(true);
        const noticesRef = collection(db, 'notices');
        let querySnapshot;
        
        try {
          // First try with createdAt field
          const q = query(
            noticesRef,
            where('isActive', '==', true),
            orderBy('createdAt', 'desc'),
            limit(5)
          );
          querySnapshot = await getDocs(q);
        } catch (error) {
          console.log('Trying with date field:', error);
          // If createdAt fails, try with date field
          const q = query(
            noticesRef,
            where('isActive', '==', true),
            orderBy('date', 'desc'),
            limit(5)
          );
          querySnapshot = await getDocs(q);
        }
        
        if (!isMounted) return;
        
        const processNoticeDoc = (doc) => {
          const data = doc.data();
          const getDate = (timestamp) => {
            try {
              return timestamp?.toDate ? timestamp.toDate() : new Date();
            } catch (error) {
              console.warn('Error parsing timestamp:', error);
              return new Date();
            }
          };
          
          return {
            id: doc.id,
            title: data.title || 'Untitled Notice',
            content: data.content || '',
            isActive: data.isActive || false,
            createdAt: getDate(data.createdAt || data.date),
            updatedAt: getDate(data.updatedAt || data.date || data.createdAt)
          };
        };
        
        const noticesData = querySnapshot.docs.map(processNoticeDoc);
        
        if (isMounted) {
          setRecentNotices(noticesData);
          setStats(prev => ({
            ...prev,
            activeNotices: { 
              ...prev.activeNotices, 
              value: noticesData.length.toString() 
            }
          }));
        }
        
      } catch (error) {
        console.error('Error fetching notices:', error);
        
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          console.log(`Retrying... (${retryCount}/${MAX_RETRIES})`);
          retryTimeout = setTimeout(fetchRecentNotices, 1000 * Math.pow(2, retryCount));
        } else if (isMounted) {
          toast.error('Failed to load notices');
          setRecentNotices([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingNotices(false);
        }
      }
    };
    
    fetchRecentNotices();
    
    return () => {
      isMounted = false;
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: FiHome },
    { name: 'Messages', href: '/admin/messages', icon: FiMessageSquare, count: stats.unreadMessages.value },
    { name: 'Notices', href: '/admin/notices', icon: FiBell },
    { name: 'Users', href: '/admin/users', icon: FiUsers },
    { name: 'Settings', href: '/admin/settings', icon: FiSettings },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      <div className="flex-1 flex">
        {/* Desktop Sidebar */}
        <div className={`hidden md:flex flex-col bg-white border-r border-gray-200 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } transition-all duration-200`}>
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center px-4">
              {isSidebarOpen && <h1 className="text-xl font-semibold">Admin</h1>}
              <button
                onClick={toggleSidebar}
                className="ml-auto p-1 text-gray-400 hover:text-gray-500"
              >
                {isSidebarOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
              </button>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    location.pathname === item.href
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {isSidebarOpen && item.name}
                  {isSidebarOpen && item.count && (
                    <span className="ml-auto bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center text-gray-700 hover:text-gray-900"
            >
              <FiLogOut className="mr-3 h-5 w-5" />
              {isSidebarOpen && 'Sign out'}
            </button>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-100">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route
                index
                element={
                  <div className="space-y-8">
                    {/* Welcome Header */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h1 className="text-2xl font-bold text-gray-900">
                            Welcome back, {user?.displayName || 'Admin'}!
                          </h1>
                          <p className="mt-1 text-sm text-gray-500">
                            Here's what's happening with your school today.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Quick Stats */}
                      <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {Object.entries(stats).map(([key, stat]) => (
                            <div
                              key={key}
                              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-center">
                                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                                  <stat.icon className="h-6 w-6" />
                                </div>
                                <div className="ml-4">
                                  <p className="text-sm font-medium text-gray-500">
                                    {stat.name}
                                  </p>
                                  <p className="text-2xl font-semibold text-gray-900">
                                    {stat.value}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Recent Notices */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                          <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">
                              Recent Notices
                            </h2>
                            <button
                              onClick={() => navigate('/admin/notices')}
                              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                            >
                              View all
                            </button>
                          </div>
                          {isLoadingNotices ? (
                            <div className="flex justify-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            </div>
                          ) : recentNotices.length > 0 ? (
                            <div className="space-y-4">
                              {recentNotices.map((notice) => (
                                <div
                                  key={notice.id}
                                  className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                                >
                                  <div className="flex justify-between">
                                    <h3 className="font-medium text-gray-900">
                                      {notice.title}
                                    </h3>
                                    <span className="text-xs text-gray-500">
                                      {notice.createdAt.toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                                    {notice.content}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              No active notices found.
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                          <h2 className="text-lg font-semibold text-gray-900 mb-6">
                            Quick Actions
                          </h2>
                          <div className="space-y-3">
                            <button
                              onClick={() => navigate('/admin/notices/new')}
                              className="w-full flex items-center justify-between p-3 rounded-md border border-gray-200 hover:bg-gray-50"
                            >
                              <div className="flex items-center">
                                <div className="p-2 rounded-full bg-indigo-100 text-indigo-600">
                                  <FiPlus className="h-4 w-4" />
                                </div>
                                <span className="ml-3 text-sm font-medium text-gray-700">
                                  Add New Notice
                                </span>
                              </div>
                              <FiArrowRight className="h-4 w-4 text-gray-400" />
                            </button>
                          </div>
                        </div>

                        {/* System Status */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                          <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            System Status
                          </h2>
                          <div className="space-y-4">
                            <div className="flex items-center">
                              <div className="p-1 rounded-full bg-green-100">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              </div>
                              <span className="ml-3 text-sm font-medium text-gray-700">
                                All systems operational
                              </span>
                            </div>
                            <div className="flex items-center">
                              <div className="p-1 rounded-full bg-green-100">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              </div>
                              <span className="ml-3 text-sm font-medium text-gray-700">
                                Database connection active
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              />
              <Route path="notices/*" element={<NoticesManager />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;