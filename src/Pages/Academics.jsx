import React from 'react';
import { FaBook, FaChalkboardTeacher, FaFlask, FaMusic, FaRunning, FaGraduationCap } from 'react-icons/fa';

const curriculum = [
  {
    level: 'Pre-Primary (LKG & UKG)',
    description: 'Play-based learning to develop cognitive, social, and motor skills in young children',
    focus: ['Phonics & Language Development', 'Pre-Math Concepts', 'Sensory Activities', 'Art & Craft', 'Music & Movement']
  },
  {
    level: 'Primary (I - V)',
    description: 'Foundational learning with emphasis on literacy, numeracy, and holistic development',
    focus: ['Language Skills', 'Mathematics', 'Environmental Studies', 'Computer Basics', 'Physical Education']
  },
  {
    level: 'Upper Primary (VI - VII)',
    description: 'Structured learning with introduction to core subjects and skill development',
    focus: ['Science', 'Mathematics', 'Social Studies', 'Languages', 'Computer Science']
  }
];

const learningApproach = [
  {
    icon: <FaChalkboardTeacher className="text-3xl text-blue-600" />,
    title: 'Activity-Based Learning',
    description: 'Interactive classroom sessions with hands-on activities and practical demonstrations'
  },
  {
    icon: <FaFlask className="text-3xl text-green-600" />,
    title: 'Experiential Learning',
    description: 'Laboratory work, field trips, and real-world applications of concepts'
  },
  {
    icon: <FaMusic className="text-3xl text-purple-600" />,
    title: 'Co-curricular Activities',
    description: 'Music, arts, sports, and clubs for holistic development'
  }
];

export default function Academics() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-50 pt-24">
      {/* Hero Section */}
      <section className="bg-blue-700 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Academic Excellence</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Nurturing young minds through a balanced curriculum and innovative teaching methodologies
          </p>
        </div>
      </section>

      {/* Curriculum Overview */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Curriculum</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {curriculum.map((stage, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <FaBook className="text-blue-600 text-xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{stage.level}</h3>
                <p className="text-gray-600 mb-4">{stage.description}</p>
                <ul className="space-y-2">
                  {stage.focus.map((item, i) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Approach */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Learning Approach</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {learningApproach.map((item, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hostel Facility */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Hostel Facility</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Safe and comfortable boarding for students with modern amenities and 24/7 care
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Our Hostel Features:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Spacious and well-ventilated rooms with attached bathrooms</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Nutritious and hygienic meals (breakfast, lunch, evening snacks, and dinner)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>24/7 security and CCTV surveillance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Dedicated study hours with supervised tutoring</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Recreational facilities and indoor games</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Regular health check-ups and medical facilities</span>
                </li>
              </ul>
              <div className="mt-8">
                <p className="text-gray-700 mb-4">For more details about hostel admission and fees, please contact:</p>
                <p className="font-medium text-blue-600">
                  Hostel Warden: +91 XXXXXXXXXX<br />
                  Email: hostel@dpspaharpur.edu.in
                </p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src="https://res.cloudinary.com/dhhzoshz7/image/upload/v1757213975/hostel_room.jpg" 
                alt="School Hostel Facilities"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Assessment & Evaluation */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Assessment & Evaluation</h2>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <FaGraduationCap className="mr-2 text-blue-600" />
                  Continuous Assessment
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Regular class tests and quizzes
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Project work and presentations
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Practical and oral assessments
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <FaRunning className="mr-2 text-green-600" />
                  Holistic Development
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Co-scholastic activities evaluation
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Life skills and value education
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Regular parent-teacher meetings
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
