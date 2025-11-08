import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const AdmissionPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      <Helmet>
        <title>Admission - School Name</title>
        <meta name="description" content="Information about school admission process" />
      </Helmet>
      
      <motion.div 
        className="max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 mx-auto" style={{ maxWidth: '90%' }}>
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <FaCalendarAlt className="w-12 h-12 text-blue-600" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Application for Admission Test Not Started Yet
          </h1>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-10 rounded-r">
            <div className="flex items-start">
              <FaInfoCircle className="h-6 w-6 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-blue-700 text-left">
                The admission process for the upcoming academic session has not started yet. 
                Please check back later or contact the school office for more information.
              </p>
            </div>
          </div>
          
          <div className="space-y-6 mt-10">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Expected Timeline</h3>
              <p className="text-gray-700">Admissions typically begin in January each year.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Contact Information</h3>
              <p className="text-gray-700">
                For any queries, please email us at{' '}
                <a 
                  href="mailto:info@dinapublicschool.edu" 
                  className="text-blue-600 hover:underline font-medium"
                >
                  info@dinapublicschool.edu
                </a>
              </p>
            </div>
          </div>
          
          <div className="mt-12">
            <Link 
              to="/" 
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm hover:shadow-md"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdmissionPage;
