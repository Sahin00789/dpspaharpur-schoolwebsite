import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiMapPin, FiPhone, FiMail, FiClock, FiWifi, FiBook, FiUsers, FiMonitor } from 'react-icons/fi';

export default function CampusPaharpur() {
  const campus = {
    name: 'Paharpur',
    address: 'Paharpur, Banshihari, Dakshin Dinajpur, West Bengal 733201',
    phone: '+91 1234567890',
    email: 'paharpur@dps.edu',
    hours: 'Monday - Saturday: 8:00 AM - 4:00 PM',
    established: '2005',
    principal: 'Mrs. Anjali Sharma',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    about: 'The Paharpur campus of Dina Public School is a premier educational institution committed to academic excellence and holistic development. Our state-of-the-art facilities and experienced faculty provide a nurturing environment for students to thrive.'
  };

  const facilities = [
    { icon: <FiBook className="w-6 h-6" />, title: 'Modern Classrooms', description: 'Spacious and well-ventilated classrooms with smart boards' },
    { icon: <FiMonitor className="w-6 h-6" />, title: 'Computer Lab', description: 'Fully equipped with latest technology and high-speed internet' },
    { icon: <FiWifi className="w-6 h-6" />, title: 'Wi-Fi Campus', description: 'High-speed internet access across the campus' },
    { icon: <FiUsers className="w-6 h-6" />, title: 'Auditorium', description: 'Air-conditioned auditorium for events and functions' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-50">
      {/* Header with Back Button */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link 
              to="/campuses" 
              className="text-blue-600 hover:text-blue-800 transition-colors flex items-center"
            >
              <FiArrowLeft className="mr-2" /> Back to Campuses
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-blue-700 overflow-hidden">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-20"
            src={campus.image}
            alt={campus.name}
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {campus.name} Campus
          </h1>
          <p className="mt-6 text-xl text-blue-100 max-w-3xl">
            Providing quality education in Paharpur since {campus.established}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* About Section */}
        <section className="mb-16">
          <div className="bg-white shadow rounded-xl overflow-hidden">
            <div className="px-6 py-8 sm:p-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About Our Campus</h2>
              <div className="prose max-w-none text-gray-600">
                <p className="text-lg">{campus.about}</p>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Principal's Message</h3>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <span className="text-xl font-semibold">{campus.principal.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{campus.principal}</p>
                        <p className="text-sm text-gray-500">Principal</p>
                        <p className="mt-2 text-gray-600">"We are committed to nurturing young minds with a perfect blend of academics, sports, and co-curricular activities."</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Facts</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <FiClock className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2" />
                        <span>Established: {campus.established}</span>
                      </li>
                      <li className="flex items-center">
                        <FiUsers className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2" />
                        <span>Students: 1200+</span>
                      </li>
                      <li className="flex items-center">
                        <FiBook className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2" />
                        <span>Classes: Nursery to Class 12</span>
                      </li>
                      <li className="flex items-center">
                        <FiWifi className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2" />
                        <span>Smart Classrooms: 30+</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Facilities Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Facilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((facility, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-blue-600 mb-4">{facility.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{facility.title}</h3>
                <p className="text-gray-600">{facility.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section>
          <div className="bg-white shadow rounded-xl overflow-hidden">
            <div className="px-6 py-8 sm:p-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Visit Us</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <FiMapPin className="flex-shrink-0 h-6 w-6 text-blue-600 mt-1 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Address</p>
                        <p className="text-gray-600">{campus.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FiPhone className="flex-shrink-0 h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Phone</p>
                        <p className="text-gray-600">{campus.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FiMail className="flex-shrink-0 h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <a href={`mailto:${campus.email}`} className="text-blue-600 hover:underline">
                          {campus.email}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FiClock className="flex-shrink-0 h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Office Hours</p>
                        <p className="text-gray-600">{campus.hours}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Location Map</h3>
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3601.234567890123!2d88.12345678901234!3d25.123456789012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDA3JzI0LjQiTiA4OMKwMDcnMjQuNSJF!5e0!3m2!1sen!2sin!4v1234567890123"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      title="Campus Location"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
