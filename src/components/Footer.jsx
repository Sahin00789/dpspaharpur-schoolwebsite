import { Link } from 'react-router-dom';
import { 
  FiMapPin, 
  FiPhone, 
  FiMail, 
  FiClock, 
  FiFacebook, 
  FiInstagram, 
  FiYoutube, 
  FiTwitter,
  FiExternalLink,
  FiMail as FiNewsletter,
  FiSend
} from 'react-icons/fi';
import { FaWhatsapp, FaSchool, FaGraduationCap } from 'react-icons/fa';
import { MdOutlineImportantDevices } from 'react-icons/md';
import schoolInfo from '../hooks/useSchoolInfo';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Safely access school info with fallbacks
  const schoolName = schoolInfo?.name || 'Dina Public School';
  const established = schoolInfo?.established || '2022';
  const address = schoolInfo?.address?.fullAddress || 'Paharpur, Banshihari, Dakshin Dinajpur, West Bengal - 733125';
  const shortName = schoolInfo?.shortName || 'DPS';
  
  // Handle phone numbers - support both string and array formats
  const defaultPhone = ['+91 62958 84463'];
  const contactPhones = Array.isArray(schoolInfo?.contact?.phone) 
    ? schoolInfo.contact.phone 
    : schoolInfo?.contact?.phone 
      ? [schoolInfo.contact.phone] 
      : defaultPhone;
  
  const contact = {
    phone: contactPhones,
    email: schoolInfo?.contact?.email || ['info@dinapublicschool.edu', 'principal@dinapublicschool.edu']
  };
  const socialMedia = schoolInfo?.socialMedia || {
    facebook: 'https://facebook.com/dinapublicschool',
    twitter: 'https://twitter.com/dinapublicschool',
    instagram: 'https://instagram.com/dinapublicschool',
    youtube: 'https://youtube.com/dinapublicschool',
    whatsapp: 'https://wa.me/911234567890'
  };
  const timings = schoolInfo?.timings || '7:30 AM - 1:30 PM (Mon-Sat)';
  
  const currentYear = new Date().getFullYear();
  
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    try {
      setLoading(true);
      // TODO: Implement newsletter subscription logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success('Thank you for subscribing to our newsletter!');
      setEmail('');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <footer className="relative overflow-hidden mt-auto">
      {/* Glass Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] opacity-5"></div>
      </div>
      <div className="absolute inset-0 bg-white/10 backdrop-blur-lg"></div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* School Info */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <FaSchool className="text-teal-400 text-3xl mr-3" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                {schoolName}
              </h3>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Empowering young minds with quality education since {established}.
            </p>
            <div className="flex items-center text-gray-400 text-sm">
              <FiMapPin className="mr-2 text-teal-400" />
              <span>{address}</span>
            </div>
            
            {/* Trust Badges */}
            <div className="mt-6 pt-6 border-t border-gray-800">
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <MdOutlineImportantDevices className="text-teal-400 text-lg" />
                <span>Secure & Responsive Website</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-5 text-white border-b border-gray-700 pb-2 inline-block">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { to: '/about', text: 'About Us' },
                { to: '/academics', text: 'Academics' },
                { to: '/admission', text: 'Admission' },
                { to: '/notices', text: 'Notices & Circulars' },
                { to: '/gallery', text: 'Photo Gallery' },
                { to: '/contact', text: 'Contact Us' },
                { to: '/results', text: 'Results' },
                
              ].map((item, index) => (
                <li key={index} className="group">
                  <Link 
                    to={item.to} 
                    className="text-gray-400 hover:text-teal-400 transition-colors flex items-center group-hover:translate-x-1 duration-200"
                  >
                    <span className="text-teal-400 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-5 text-white border-b border-gray-700 pb-2 inline-block">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <div className="bg-gray-800/80 backdrop-blur-sm p-2 rounded-lg mr-3 group-hover:bg-teal-500/90 transition-all duration-300">
                </div>
                <div>
                  <h5 className="text-gray-300 font-medium">Our Location</h5>
                  <p className="text-gray-400 text-sm">{address}</p>
                </div>
              </li>
              
              {/* Contact Numbers */}
              {contact.phone.map((phone, index) => (
                <li key={`phone-${index}`} className="flex items-center group">
                  <div className="bg-gray-800/80 backdrop-blur-sm p-2 rounded-lg mr-3 group-hover:bg-teal-500/90 transition-all duration-300">
                    <FiPhone className="w-5 h-5 text-teal-400 group-hover:text-white" />
                  </div>
                  <div>
                    <h5 className="text-gray-300 font-medium">
                      {index === 0 ? 'Contact Number' : 'Alternate Number'}
                    </h5>
                    <a 
                      href={`tel:${phone.replace(/\D/g, '')}`} 
                      className="text-gray-400 hover:text-teal-400 text-sm transition-colors"
                    >
                      {phone}
                    </a>
                  </div>
                </li>
              ))}
              <li className="flex items-center group">
                <div className="bg-gray-800/80 backdrop-blur-sm p-2 rounded-lg mr-3 group-hover:bg-teal-500/90 transition-all duration-300">
                  <FiMail className="w-5 h-5 text-teal-400 group-hover:text-white" />
                </div>
                <div>
                  <h5 className="text-gray-300 font-medium">Email Us</h5>
                  <a 
                    href={`mailto:${contact.email?.[0] || 'info@example.com'}`}
                    className="text-gray-400 hover:text-teal-400 text-sm transition-colors break-all"
                  >
                    {contact.email?.[0] || 'info@example.com'}
                  </a>
                </div>
              </li>
              <li className="flex items-center group">
                <div className="bg-gray-800/80 backdrop-blur-sm p-2 rounded-lg mr-3 group-hover:bg-teal-500/90 transition-all duration-300">
                  <FiClock className="w-5 h-5 text-teal-400 group-hover:text-white" />
                </div>
                <div>
                  <h5 className="text-gray-300 font-medium">Working Hours</h5>
                  <p className="text-gray-400 text-sm">{timings}</p>
                </div>
              </li>
            </ul>

            {/* Social Media */}
            <div className="mt-6 pt-6 border-t border-gray-800">
              <h5 className="text-gray-300 font-medium mb-3">Connect With Us</h5>
              <div className="flex space-x-3">
                {[
                  { icon: <FiFacebook className="w-5 h-5" />, href: socialMedia.facebook, color: 'hover:bg-blue-600' },
                  { icon: <FiTwitter className="w-5 h-5" />, href: socialMedia.twitter, color: 'hover:bg-blue-400' },
                  { icon: <FiInstagram className="w-5 h-5" />, href: socialMedia.instagram, color: 'hover:bg-pink-600' },
                  { icon: <FiYoutube className="w-5 h-5" />, href: socialMedia.youtube, color: 'hover:bg-red-600' },
                  { icon: <FaWhatsapp className="w-5 h-5" />, href: socialMedia.whatsapp, color: 'hover:bg-green-500' },
                ].map((social, index) => (
                  social.href && (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 rounded-full bg-gray-800/80 backdrop-blur-sm flex items-center justify-center text-gray-300 hover:text-white transition-all ${social.color} shadow-md hover:scale-105`}
                      aria-label={`Follow us on ${social.href.includes('facebook') ? 'Facebook' : 
                        social.href.includes('twitter') ? 'Twitter' : 
                        social.href.includes('instagram') ? 'Instagram' : 
                        social.href.includes('youtube') ? 'YouTube' : 'WhatsApp'}`}
                    >
                      {social.icon}
                    </a>
                  )
                ))}
              </div>
            </div>
          </div>

          {/* Our Location */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-5 text-white border-b border-gray-700 pb-2 inline-block">
              Our Location
            </h4>
            <div className="bg-gray-800/70 backdrop-blur-sm border border-gray-700/50 rounded-lg overflow-hidden mb-4 shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7215.27171663533!2d88.341211!3d25.3075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDE4JzI3LjEiTiA4OMKwMjAnNDguNiJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin&z=13&ll=25.3075,88.341211&output=embed"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                className="rounded-lg"
                title="Dina Public School Location"
              ></iframe>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-gray-800/70 backdrop-blur-sm border border-gray-700/50 p-6 rounded-xl shadow-xl hover:bg-gray-800/80 transition-all duration-300">
                  <FiMapPin className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <h5 className="text-gray-300 font-medium">Address</h5>
                  <p className="text-gray-400 text-sm">{address}</p>
                  <a 
                    href="https://maps.app.goo.gl/example" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-teal-400 text-xs flex items-center mt-1 hover:underline"
                  >
                    View on Google Maps <FiExternalLink className="ml-1" />
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-gray-800/70 backdrop-blur-sm border border-gray-700/50 p-6 rounded-xl shadow-xl hover:bg-gray-800/80 transition-all duration-300">
                  <FiClock className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <h5 className="text-gray-300 font-medium">Visiting Hours</h5>
                  <p className="text-gray-400 text-sm">Monday - Saturday: 8:00 AM - 2:00 PM</p>
                  <p className="text-gray-400 text-sm">Sunday: Closed</p>
                </div>
              </div>
             
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-700/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            {/* Developer Info */}
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">
                Developed by <span className="text-teal-400">Sahin Arman</span>
              </p>
              <a 
                href="mailto:sahin401099@gmail.com" 
                className="text-gray-500 hover:text-teal-400 text-xs flex items-center justify-center md:justify-start space-x-1 mt-1"
              >
                <FiMail className="inline" />
                <span>sahin401099@gmail.com</span>
              </a>
            </div>
            
            {/* Quick Links */}
            <div className="text-center">
              <div className="flex flex-wrap justify-center space-x-4 text-sm">
                <Link to="/privacy-policy" className="text-gray-500 hover:text-teal-400 transition-colors">
                  Privacy Policy
                </Link>
                <span className="text-gray-700">|</span>
                <Link to="/terms" className="text-gray-500 hover:text-teal-400 transition-colors">
                  Terms
                </Link>
                <span className="text-gray-700">|</span>
                <Link to="/sitemap" className="text-gray-500 hover:text-teal-400 transition-colors">
                  Sitemap
                </Link>
              </div>
            </div>
          </div>
          
          {/* Copyright Text */}
          <div className="border-t border-gray-700 pt-6 text-center">
            <p className="text-gray-500 text-sm">
              &copy; {currentYear} {schoolName}. All rights reserved.
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Designed & Developed with ❤️ by Sahin Arman
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
