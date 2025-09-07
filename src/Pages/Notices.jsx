import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'framer-motion';
import { FiCalendar, FiSearch, FiAlertCircle, FiInfo } from 'react-icons/fi';

// Notice categories - should match those in NoticesManager
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

const formatDate = (timestamp) => {
  if (!timestamp?.toDate) return 'N/A';
  const date = timestamp.toDate();
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const NoticeCard = ({ notice }) => {
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{notice.title}</h3>
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <FiCalendar className="mr-1.5" />
              <span>Posted: {formatDate(notice.createdAt)}</span>
              {notice.endDate && (
                <span className="ml-3">
                  <FiInfo className="inline mr-1" />
                  Valid until: {formatDate(notice.endDate)}
                </span>
              )}
            </div>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            notice.important 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {notice.category}
          </span>
        </div>
        
        <p className="text-gray-600 mt-2">{notice.content}</p>
        
        {notice.important && (
          <div className="mt-3 flex items-center text-sm text-yellow-700 bg-yellow-50 p-2 rounded-lg">
            <FiAlertCircle className="flex-shrink-0 mr-2" />
            <span>Important Notice</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      try {
        console.log('Fetching notices from Firestore...');
        
        // First, check if the collection exists and has any documents
        const noticesRef = collection(db, 'notices');
        const snapshot = await getDocs(noticesRef);
        
        console.log('Total notices in collection:', snapshot.size);
        
        if (snapshot.empty) {
          console.log('No notices found in the collection');
          setNotices([]);
          setLoading(false);
          return;
        }
        
        // Log the first document to see its structure
        const firstDoc = snapshot.docs[0];
        console.log('First notice document:', {
          id: firstDoc.id,
          ...firstDoc.data()
        });
        
        // Build the query for active notices
        let q;
        try {
          // Try with createdAt first
          q = query(
            noticesRef,
            where('isActive', '==', true),
            orderBy('createdAt', 'desc')
          );
          // Test the query to see if it works
          await getDocs(q);
        } catch (error) {
          console.log('Error with createdAt field, trying with date field...', error);
          try {
            q = query(
              noticesRef,
              where('isActive', '==', true),
              orderBy('date', 'desc')
            );
            await getDocs(q);
          } catch (error2) {
            console.log('Error with date field, fetching without ordering...', error2);
            q = query(
              noticesRef,
              where('isActive', '==', true)
            );
          }
        }
        
        const querySnapshot = await getDocs(q);
        console.log('Active notices found:', querySnapshot.size);
        
        const noticesList = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log('Processing notice:', { id: doc.id, ...data });
          
          noticesList.push({
            id: doc.id,
            title: data.title || 'Untitled Notice',
            content: data.content || '',
            category: data.category || 'General',
            important: Boolean(data.important),
            isActive: data.isActive !== undefined ? data.isActive : true,
            createdAt: data.createdAt || null,
            updatedAt: data.updatedAt || null,
            endDate: data.endDate || null,
            ...data
          });
        });
        
        console.log('Processed notices:', noticesList);
        setNotices(noticesList);
      } catch (error) {
        console.error('Error in fetchNotices:', error);
        toast.error('Failed to load notices. Please check the console for details.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  // Group notices by category
  const noticesByCategory = notices.reduce((acc, notice) => {
    const category = notice.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(notice);
    return acc;
  }, {});

  // Filter categories based on search term
  const filteredCategories = Object.entries(noticesByCategory)
    .filter(([category, items]) => {
      if (selectedCategory !== 'All' && category !== selectedCategory) return false;
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      return items.some(
        item => 
          item.title.toLowerCase().includes(searchLower) ||
          item.content.toLowerCase().includes(searchLower)
      );
    })
    .sort(([catA], [catB]) => catA.localeCompare(catB));

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            School Notices
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Stay updated with the latest announcements and information
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search notices..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <select
                className="block w-full pl-3 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                {NOTICE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <FiInfo className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No notices found</h3>
            <p className="mt-1 text-gray-500">
              {searchTerm || selectedCategory !== 'All' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Check back later for new notices.'}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredCategories.map(([category, categoryNotices]) => (
              <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full px-6 py-4 text-left focus:outline-none"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {category}
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {categoryNotices.length} {categoryNotices.length === 1 ? 'notice' : 'notices'}
                      </span>
                    </h2>
                    <svg
                      className={`h-5 w-5 text-gray-500 transform transition-transform ${
                        expandedCategories[category] ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                {(expandedCategories[category] || Object.keys(expandedCategories).length === 0) && (
                  <div className="px-6 pb-6 grid gap-6 md:grid-cols-2">
                    {categoryNotices
                      .filter(notice => 
                        !searchTerm || 
                        notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        notice.content.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map(notice => (
                        <NoticeCard key={notice.id} notice={notice} />
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notices;
