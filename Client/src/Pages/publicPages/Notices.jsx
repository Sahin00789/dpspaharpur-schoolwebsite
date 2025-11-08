import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiSearch, FiAlertCircle, FiInfo } from 'react-icons/fi';
import PropTypes from 'prop-types';

// Notice categories
const NOTICE_CATEGORIES = [
  'All',
  'General',
  'Academics',
  'Events',
  'Exams',
  'Holidays',
  'Sports',
  'Admissions',
  'Others'
];

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
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

// Preload images
const preloadImages = (images) => {
  images.forEach(image => {
    const img = new Image();
    img.src = image.thumbnail || image.url;
  });
};

const Notices = ({
  notices = [],
  loading = false,
  searchTerm: initialSearchTerm = '',
  selectedCategory: initialSelectedCategory = 'All',
  expandedCategories: initialExpandedCategories = {}
}) => {
  // Preload images when notices change
  useEffect(() => {
    if (notices.length > 0) {
      preloadImages(notices);
    }
  }, [notices]);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedCategory, setSelectedCategory] = useState(initialSelectedCategory);
  const [expandedCategories, setExpandedCategories] = useState(initialExpandedCategories);
  
  // Filter active notices and sort by date
  const activeNotices = useMemo(() => {
    return notices
      .filter(notice => notice.isActive)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [notices]);

  // Group notices by category
  const noticesByCategory = activeNotices.reduce((acc, notice) => {
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

  // If loading, show a skeleton loader
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-12"></div>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="h-12 bg-gray-200 rounded flex-1"></div>
              <div className="h-12 bg-gray-200 rounded w-64"></div>
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
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

// Prop types for documentation purposes
Notices.propTypes = {
  notices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      important: PropTypes.bool,
      isActive: PropTypes.bool,
      createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      url: PropTypes.string,
      thumbnail: PropTypes.string,
    })
  ),
  loading: PropTypes.bool,
  searchTerm: PropTypes.string,
  selectedCategory: PropTypes.string,
  expandedCategories: PropTypes.object,
};

export default Notices;
