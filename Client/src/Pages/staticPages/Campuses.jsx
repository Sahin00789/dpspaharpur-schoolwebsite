import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail, FiGlobe, FiClock } from 'react-icons/fi';

const branches = [
  { 
    id: 1, 
    name: 'Paharpur', 
    path: '/campuses/paharpur', 
    address: 'Paharpur, Banshihari, Dakshin Dinajpur',
    phone: '+91 1234567890',
    email: 'paharpur@dps.edu',
    hours: 'Mon-Sat: 8:00 AM - 4:00 PM',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  },
  { 
    id: 2, 
    name: 'Mirakuri', 
    path: '/campuses/mirakuri', 
    address: 'Mirakuri, Banshihari, Dakshin Dinajpur',
    phone: '+91 1234567891',
    email: 'mirakuri@dps.edu',
    hours: 'Mon-Sat: 8:00 AM - 4:00 PM',
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80'
  },
  { 
    id: 3, 
    name: 'Madrasha', 
    path: '/campuses/madrasha', 
    address: 'Mirakuri, Banshihari, Dakshin Dinajpur',
    phone: '+91 1234567892',
    email: 'madrasha@dps.edu',
    hours: 'Mon-Sat: 8:00 AM - 4:00 PM',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  },
  { 
    id: 4, 
    name: 'Amrulbari', 
    path: '/campuses/amrulbari', 
    address: 'Amrulbari, Tapan, Dakshin Dinajpur',
    phone: '+91 1234567893',
    email: 'amrulbari@dps.edu',
    hours: 'Mon-Sat: 8:00 AM - 4:00 PM',
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80'
  },
];

export default function Campuses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(null);

  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-50">
      <section className="pt-24 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Campuses</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore our network of campuses, each providing excellent education and facilities to nurture young minds.
            </p>
          </div>

          <div className="mb-8 max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search campuses..."
                className="w-full px-6 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredBranches.map((branch) => (
                <motion.div
                  key={branch.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <Link to={branch.path}>
                    <div className="h-48 overflow-hidden">
                      <img
                        src={branch.image}
                        alt={branch.name}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-2">{branch.name} Campus</h2>
                      <div className="flex items-center text-gray-600 mb-3">
                        <FiMapPin className="mr-2 flex-shrink-0" />
                        <p className="text-sm">{branch.address}</p>
                      </div>
                      <div className="flex items-center text-gray-600 mb-3">
                        <FiPhone className="mr-2 flex-shrink-0" />
                        <p className="text-sm">{branch.phone}</p>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FiClock className="mr-2 flex-shrink-0" />
                        <p className="text-sm">{branch.hours}</p>
                      </div>
                      <button
                        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedBranch(branch);
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
