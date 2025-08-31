import { Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiMail, FiClock, FiFacebook, FiInstagram, FiYoutube, FiTwitter } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* School Info */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4 text-white">Dina Public School</h3>
            <p className="text-gray-400 mb-4">Empowering young minds with quality education since 2010.</p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiFacebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiInstagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaWhatsapp className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiYoutube className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4 text-white border-b border-gray-700 pb-2">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/academics" className="text-gray-400 hover:text-white transition-colors">Academics</Link></li>
              <li><Link to="/admission" className="text-gray-400 hover:text-white transition-colors">Admission</Link></li>
              <li><Link to="/notices" className="text-gray-400 hover:text-white transition-colors">Notices</Link></li>
              <li><Link to="/gallery" className="text-gray-400 hover:text-white transition-colors">Gallery</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4 text-white border-b border-gray-700 pb-2">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FiMapPin className="w-5 h-5 text-teal-400 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-400">123 Education Street, Paharpur, Dina, Jhelum, Punjab, Pakistan</span>
              </li>
              <li className="flex items-center">
                <FiPhone className="w-5 h-5 text-teal-400 mr-3" />
                <a href="tel:+923001234567" className="text-gray-400 hover:text-white transition-colors">+92 300 1234567</a>
              </li>
              <li className="flex items-center">
                <FiMail className="w-5 h-5 text-teal-400 mr-3" />
                <a href="mailto:info@dinapublicschool.edu.pk" className="text-gray-400 hover:text-white transition-colors">info@dinapublicschool.edu.pk</a>
              </li>
              <li className="flex items-center">
                <FiClock className="w-5 h-5 text-teal-400 mr-3" />
                <span className="text-gray-400">Mon - Fri: 8:00 AM - 2:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4 text-white border-b border-gray-700 pb-2">Newsletter</h4>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates and news.</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 w-full rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                required
              />
              <button 
                type="submit" 
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 rounded-r-lg transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Dina Public School. All rights reserved.</p>
          <div className="mt-2 text-sm">
            <Link to="/privacy-policy" className="hover:text-white transition-colors mr-4">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
