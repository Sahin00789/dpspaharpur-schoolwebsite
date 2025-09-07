import React from 'react';
import { FaQuoteLeft } from 'react-icons/fa';

export default function About() {
  return (
    <div className="bg-gradient-to-br from-white to-slate-100 min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">About Dina Public School</h1>
          <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-4xl">
            We are committed to holistic education with a focus on character, creativity, and community. 
            Our institution serves diverse neighborhoods while maintaining a unified standard of excellence.
          </p>
          
          <div className="grid md:grid-cols-2 gap-12 mt-16">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Mission</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                To provide quality education that empowers students to become responsible, innovative, and compassionate global citizens. 
                We strive to create a nurturing environment that fosters intellectual curiosity, critical thinking, and personal growth.
              </p>
              <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Our Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                To be a premier educational institution that shapes future leaders through academic excellence, 
                character development, and commitment to social responsibility.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-xl h-full flex flex-col border border-blue-100 transform hover:scale-[1.01] transition-all duration-300">
              <div className="relative flex-grow">
                <div className="absolute  -top-4 -left-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaQuoteLeft className="text-blue-500 text-2xl" />
                </div>
                <h2 className="text-3xl ml-16 font-bold mb-8 text-blue-800 relative z-10 pl-4 border-l-4 border-blue-500">
                  Founder's Message
                </h2>
                
                <div className="flex flex-col lg:flex-row gap-8 mb-8">
                  <div className="w-full lg:w-2/5 xl:w-1/3 flex-shrink-0">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                      <img 
                        src="https://res.cloudinary.com/dhhzoshz7/image/upload/v1757213988/founder2_lhc5ha.jpg" 
                        alt="Moulana Sajjad Hossain Kasimi, Founder & Principal"
                        className="relative w-full h-auto rounded-xl shadow-lg object-cover border-4 border-white"
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <p className="font-semibold text-lg text-blue-800">Moulana Sajjad Hossain Kasimi</p>
                      <p className="text-blue-600">Founder</p>
                      <p className="text-sm text-gray-600 mt-1">Dina Public School</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-inner border border-blue-50">
                      <p className="text-gray-700 italic text-lg leading-relaxed relative pl-6">
                        <span className="absolute left-0 top-0 text-4xl text-blue-200 font-serif leading-none">"</span>
                        Education is the most powerful weapon which you can use to change the world.
                        <span className="text-4xl text-blue-200 font-serif leading-none relative top-4">"</span>
                        <span className="block text-blue-600 text-sm mt-2 font-medium">- Nelson Mandela</span>
                      </p>
                      <p className="mt-4 text-gray-700 leading-relaxed">
                        These profound words have been the guiding principle behind our journey in establishing Dina Public School. 
                        We believe in nurturing not just academic excellence but also strong moral character and social responsibility.
                      </p>
                    </div>
                    
                    <div className="space-y-4 text-gray-700">
                      <p className="leading-relaxed">
                        Our vision was to create an institution that goes beyond textbooks and examinations, nurturing young minds to become 
                        critical thinkers, compassionate individuals, and responsible citizens. We are committed to providing an environment where 
                        every child can discover their unique potential and develop the skills necessary to thrive in an ever-changing world.
                      </p>
                      <p className="leading-relaxed">
                        As we continue our journey, we remain steadfast in our commitment to academic excellence, character building, and holistic development. 
                        Our goal is to shape future leaders who will make meaningful contributions to society while upholding the highest ethical standards.
                      </p>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-blue-100">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <p className="font-semibold text-blue-900 text-lg">Moulana Sajjad Hossain Kasimi</p>
                          <p className="text-blue-600">Founder, Dina Public School</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Our Core Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Excellence',
                  description: 'Striving for the highest standards in academics and character development.'
                },
                {
                  title: 'Integrity',
                  description: 'Upholding honesty, ethics, and moral principles in all our actions.'
                },
                {
                  title: 'Innovation',
                  description: 'Encouraging creativity and embracing new ideas in teaching and learning.'
                },
                {
                  title: 'Inclusivity',
                  description: 'Creating a welcoming environment that celebrates diversity and promotes equality.'
                },
                {
                  title: 'Respect',
                  description: 'Valuing every individual and fostering mutual respect among all members of our community.'
                },
                {
                  title: 'Responsibility',
                  description: 'Encouraging accountability and commitment to personal and social responsibilities.'
                }
              ].map((value, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold mb-3 text-blue-700">{value.title}</h3>
                  <p className="text-gray-700">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
