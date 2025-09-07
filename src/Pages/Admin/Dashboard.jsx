import { Link } from 'react-router-dom';
import { 
  FiHome, FiBell, FiUsers, FiMessageSquare, 
  FiClock, FiArrowRight, FiFileText
} from 'react-icons/fi';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { useNoticeStore } from '../../store/useNoticeStore';
import { useMessageStore } from '../../store/useMessageStore';
import { useEffect, useState, useCallback } from 'react';
import { auth } from '../../firebase';
import { motion } from 'framer-motion';
import useAdmissionStore from '../../store/useAdmissionStore';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { notices: recentNotices = [], subscribeToNotices } = useNoticeStore();
  const { fetchApplications } = useAdmissionStore();
  const { unreadMessages = 0, activeNotices = 0 } = useDashboardStats();
  const [admissionStats, setAdmissionStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  
  // Format date to relative time
  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      const now = new Date();
      const noticeDate = typeof date === 'object' ? date : new Date(date);
      const diffInDays = Math.floor((now - noticeDate) / (1000 * 60 * 60 * 24));
      
      if (diffInDays === 0) return 'Today';
      if (diffInDays === 1) return 'Yesterday';
      if (diffInDays < 7) return `${diffInDays} days ago`;
      return noticeDate.toLocaleDateString();
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'N/A';
    }
  };

  // Stats with real-time data
  const stats = [
    { 
      name: 'Active Notices', 
      value: activeNotices, 
      icon: FiBell,
      color: 'from-blue-500 to-blue-600',
      path: '/admin/notices',
      description: 'Total active notices displayed',
      trend: activeNotices > 0 ? 'up' : 'down'
    },
    { 
      name: 'Unread Messages', 
      value: unreadMessages, 
      icon: FiMessageSquare,
      color: 'from-green-500 to-green-600',
      path: '/admin/messages',
      description: 'Require your attention',
      trend: unreadMessages > 0 ? 'up' : 'same'
    },
    { 
      name: 'Admissions', 
      value: admissionStats.total,
      icon: FiUsers,
      color: 'from-purple-500 to-purple-600',
      path: '/admin/admissions',
      description: `${admissionStats.pending} pending, ${admissionStats.approved} approved`,
      trend: admissionStats.pending > 0 ? 'up' : 'same'
    },
  ];
  
  // Filter out notices without a title for display
  const validNotices = Array.isArray(recentNotices) 
    ? recentNotices.filter(notice => notice?.title)
    : [];

  // Fetch admission statistics
  const fetchAdmissionStats = useCallback(async () => {
    try {
      const { currentUser } = auth;
      if (!currentUser) {
        console.log('No user found, forcing token refresh...');
        await currentUser.getIdToken(true); // Force token refresh
      }
      
      const applications = await fetchApplications();
      const stats = {
        total: applications?.length || 0,
        pending: applications?.filter(app => app.status === 'pending')?.length || 0,
        approved: applications?.filter(app => app.status === 'approved')?.length || 0,
        rejected: applications?.filter(app => app.status === 'rejected')?.length || 0
      };
      setAdmissionStats(stats);
    } catch (error) {
      console.error('Error fetching admission stats:', error);
      // If there's an auth error, try to refresh the token
      if (error.code === 'permission-denied' || error.code === 'unauthenticated') {
        try {
          await auth.currentUser?.getIdToken(true);
          // Retry after token refresh
          const retryApps = await fetchApplications();
          const retryStats = {
            total: retryApps?.length || 0,
            pending: retryApps?.filter(app => app.status === 'pending')?.length || 0,
            approved: retryApps?.filter(app => app.status === 'approved')?.length || 0,
            rejected: retryApps?.filter(app => app.status === 'rejected')?.length || 0
          };
          setAdmissionStats(retryStats);
        } catch (retryError) {
          console.error('Retry failed:', retryError);
        }
      }
    }
  }, [fetchApplications]);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribeMessages = useMessageStore.getState().subscribeToMessages();
    
    // Subscribe to notices
    const unsubscribeNotices = subscribeToNotices(5);
    
    // Initial data fetch
    const loadData = async () => {
      try {
        await Promise.all([
          fetchAdmissionStats()
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    
    return () => {
      if (unsubscribeMessages) unsubscribeMessages();
      if (unsubscribeNotices) unsubscribeNotices();
    };
  }, [subscribeToNotices, fetchAdmissionStats]);


  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-indigo-100 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Back to Home Button */}
        <Link 
          to="/" 
          className="inline-flex items-center mb-6 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
        <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-gray-500">Welcome back! Here's what's happening with your school.</p>
        </div>

        {/* Stats Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8"
        >
          {stats.map((stat) => (
            <motion.div key={stat.name} variants={item}>
              <Link
                to={stat.path}
                className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} shadow-md`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                      <p className="mt-1 text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Notices Section */}
        <motion.div 
          variants={item}
          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
        >
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Notices
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Latest announcements and updates
                </p>
              </div>
              <Link
                to="/admin/notices"
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                View All
              </Link>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {!Array.isArray(validNotices) || validNotices.length === 0 ? (
              <div className="p-6 text-center">
                <div className="text-gray-400 mb-2">
                  <FiFileText className="mx-auto h-12 w-12 opacity-50" />
                </div>
                <h4 className="text-sm font-medium text-gray-900">No notices yet</h4>
                <p className="mt-1 text-sm text-gray-500">Create your first notice to get started</p>
                <div className="mt-4">
                  <Link
                    to="/admin/notices"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Create Notice
                  </Link>
                </div>
              </div>
            ) : (
              validNotices.slice(0, 5).map((notice) => (
                <Link
                  key={notice.id}
                  to={`/admin/notices`}
                  className="block hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="px-6 py-4">
                    <div className="flex items-start">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            {notice.title}
                          </p>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 ml-2">
                            {notice.category || 'General'}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {notice.description?.substring(0, 120)}{notice.description?.length > 120 ? '...' : ''}
                        </p>
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <FiClock className="flex-shrink-0 mr-1.5 h-3.5 w-3.5 text-gray-400" />
                          <span>{formatDate(notice.createdAt)}</span>
                        </div>
                      </div>
                      <FiArrowRight className="ml-4 h-5 w-5 text-gray-400 group-hover:text-gray-700" />
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </motion.div>
       
      </div>
      
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} DPS Paharpur. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 mt-2 md:mt-0">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;