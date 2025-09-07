import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiAward, FiBookOpen, FiUsers, FiCalendar } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import ImageSlider from '../components/ImageSlider';
import Footer from '../components/Footer';
import { SLIDER_IMAGES } from '../data/sliderImages';

const features = [
  {
    icon: <FiAward className="w-8 h-8 text-blue-600" />,
    title: 'Academic Excellence',
    description: 'Consistently achieving outstanding results with a focus on holistic education.',
  },
  {
    icon: <FiBookOpen className="w-8 h-8 text-blue-600" />,
    title: 'Comprehensive Curriculum',
    description: 'Balanced curriculum that nurtures both academic and personal growth.',
  },
  {
    icon: <FiUsers className="w-8 h-8 text-blue-600" />,
    title: 'Experienced Faculty',
    description: 'Dedicated and qualified teachers committed to student success.',
  },
  {
    icon: <FiCalendar className="w-8 h-8 text-blue-600" />,
    title: 'Year-Round Activities',
    description: 'Wide range of extracurricular activities and events.',
  },
];

const stats = [
  { value: '1000+', label: 'Students' },
  { value: '50+', label: 'Qualified Teachers' },
  { value: '95%', label: 'Success Rate' },
  { value: '10+', label: 'Years of Excellence' },
];

const HomePage = () => {
  const handleAdmissionClick = () => {
    toast.success('Redirecting to admission page...');
  };

  const sliderImages = SLIDER_IMAGES;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative pt-10 bg-gradient-to-r from-blue-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(to_bottom,transparent_1%,white,transparent_99%)]" />
        <div className="container mx-auto px-6 py-20 md:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Empowering Young Minds for a <span className="text-yellow-300">Brighter Future</span>
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Nurturing academic excellence, character development, and leadership skills in a supportive learning environment.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link 
                to="/admission" 
                className="btn btn-primary px-8 py-4 text-lg font-semibold"
                onClick={handleAdmissionClick}
              >
                Apply Now <FiArrowRight className="ml-2" />
              </Link>
              <Link 
                to="/about" 
                className="btn bg-white/10 hover:bg-white/20 border border-white/20 px-8 py-4 text-lg font-semibold backdrop-blur-sm"
              >
                Learn More
              </Link>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Image Slider Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <ImageSlider slides={sliderImages} autoPlay={true} interval={5000} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Examination Results</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Access the latest examination results and academic achievements</p>
          </div>
          
          <div className="max-w-xl mx-auto">
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center"
              whileHover={{ y: -5, scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-teal-50 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <FiAward className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">View Results</h3>
              <p className="text-gray-600 mb-6">Check out the latest examination results, </p>
              <Link 
                to="/results" 
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                View All Results <FiArrowRight className="ml-2" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center p-6 bg-white rounded-xl shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
