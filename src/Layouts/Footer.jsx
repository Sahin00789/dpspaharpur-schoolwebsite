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
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';
import  useSchoolInfo  from '../hooks/useSchoolInfo';

const translations = {
  en: {
    quickLinks: 'Quick Links',
    contactUs: 'Contact Us',
    ourLocation: 'Our Location',
    locationHead: 'Our Location',
    phoneHead: 'Contact Number',
    altPhoneHead: 'Alternate Number',
    emailHead: 'Email Us',
    hoursHead: 'Working Hours',
    visitingHours: 'Visiting Hours',
    addressHead: 'Address',
    viewMaps: 'View on Google Maps',
    developedBy: 'Developed by',
    allRights: 'All rights reserved.',
    links: {
      about: 'About Us',
      academics: 'Academics',
      gallery: 'Photo Gallery',
      contact: 'Contact Us',
      results: 'Results'
    }
  },
  bn: {
    quickLinks: 'দ্রুত লিঙ্ক',
    contactUs: 'যোগাযোগ করুন',
    ourLocation: 'আমাদের অবস্থান',
    locationHead: 'আমাদের অবস্থান',
    phoneHead: 'যোগাযোগ নম্বর',
    altPhoneHead: 'বিকল্প নম্বর',
    emailHead: 'আমাদের ইমেল করুন',
    hoursHead: 'কাজের সময়',
    visitingHours: 'পরিদর্শনের সময়',
    addressHead: 'ঠিকানা',
    viewMaps: 'গুগল ম্যাপে দেখুন',
    developedBy: 'ডেভেলপ করেছেন',
    allRights: 'সর্বস্বত্ব সংরক্ষিত।',
    links: {
      about: 'আমাদের সম্পর্কে',
      academics: 'একাডেমিকস',
      gallery: 'ফটো গ্যালারি',
      contact: 'যোগাযোগ করুন',
      results: 'ফলাফল'
    }
  }
};

const Footer = () => {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Get school info from the hook
  const schoolInfo = useSchoolInfo();
  
  // Safely access school info with fallbacks
  const schoolName = schoolInfo?.name || 'Dina Public School';
  const established = schoolInfo?.established || '2022';
  const address = schoolInfo?.address?.formatted || 'Paharpur, Banshihari, Dakshin Dinajpur, West Bengal - 733125';
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
  
  // Format timings for display
  const formatTimings = (timings) => {
    if (!timings) return '7:30 AM - 1:30 PM (Mon-Sat)';
    if (typeof timings === 'string') return timings;
    
    // If timings is an object with school and workingDays properties
    if (timings.school && timings.workingDays) {
      return `${timings.school} (${timings.workingDays})`;
    }
    
    // Fallback to default if structure is unexpected
    return '7:30 AM - 1:30 PM (Mon-Sat)';
  };
  
  const displayTimings = formatTimings(schoolInfo?.timings);
  
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
    <footer className="relative overflow-hidden mt-auto bg-emerald-900 text-white">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-emerald-900/95">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] opacity-5"></div>
      </div>
      <div className="absolute inset-0 bg-emerald-800/30 backdrop-blur-sm"></div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* School Info */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <FaSchool className="text-emerald-300 text-3xl mr-3" />
              <h3 className="text-2xl font-bold text-white">
                {schoolName}
              </h3>
            </div>
            <p className="text-emerald-100/90 mb-4 leading-relaxed">
              Empowering young minds with quality education since {established}.
            </p>
            <div className="flex items-center text-emerald-100/80 mb-2">
              <FiPhone className="mr-2 text-emerald-300" />
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
            <h3 className="text-xl font-semibold text-white mb-4 pb-2 border-b-2 border-emerald-400 inline-block">{t.quickLinks}</h3>
            <ul className="space-y-3">
              {[
                { to: '#about', text: t.links.about },
                { to: '#academics', text: t.links.academics },
                { to: '#gallery', text: t.links.gallery },
                { to: '#contact', text: t.links.contact },
                { to: 'https://marks-mint-dps-paharpur-web.vercel.app/', text: t.links.results, external: true },
                
              ].map((item, index) => (
                <li key={index} className="group">
                  {item.external ? (
                    <a 
                      href={item.to} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center group-hover:translate-x-1 duration-200"
                    >
                      <span className="text-emerald-400 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      {item.text}
                    </a>
                  ) : (
                    <a 
                      href={item.to} 
                      className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center group-hover:translate-x-1 duration-200"
                    >
                      <span className="text-emerald-400 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      {item.text}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4 pb-2 border-b-2 border-emerald-400 inline-block">{t.contactUs}</h3>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <div className="bg-gray-800/80 backdrop-blur-sm p-2 rounded-lg mr-3 group-hover:bg-emerald-500/90 transition-all duration-300">
                  <FiMapPin className="w-5 h-5 text-emerald-400 group-hover:text-white" />
                </div>
                <div>
                  <h5 className="text-gray-300 font-medium">{t.locationHead}</h5>
                  <p className="text-gray-400 text-sm">{address}</p>
                </div>
              </li>
              
              {/* Contact Numbers */}
              {contact.phone.map((phone, index) => (
                <li key={`phone-${index}`} className="flex items-center group">
                  <div className="bg-gray-800/80 backdrop-blur-sm p-2 rounded-lg mr-3 group-hover:bg-emerald-500/90 transition-all duration-300">
                    <FiPhone className="w-5 h-5 text-emerald-400 group-hover:text-white" />
                  </div>
                  <div>
                    <h5 className="text-gray-300 font-medium">
                      {index === 0 ? t.phoneHead : t.altPhoneHead}
                    </h5>
                    <a 
                      href={`tel:${phone.replace(/\D/g, '')}`} 
                      className="text-gray-400 hover:text-emerald-400 text-sm transition-colors"
                    >
                      {phone}
                    </a>
                  </div>
                </li>
              ))}
              <li className="flex items-center group">
                <div className="bg-gray-800/80 backdrop-blur-sm p-2 rounded-lg mr-3 group-hover:bg-emerald-500/90 transition-all duration-300">
                  <FiMail className="w-5 h-5 text-emerald-400 group-hover:text-white" />
                </div>
                <div>
                  <h5 className="text-gray-300 font-medium">{t.emailHead}</h5>
                  <a 
                    href={`mailto:${contact.email?.[0] || 'info@example.com'}`}
                    className="text-gray-400 hover:text-emerald-400 text-sm transition-colors break-all"
                  >
                    {contact.email?.[0] || 'info@example.com'}
                  </a>
                </div>
              </li>
              <li className="flex items-center group">
                <div className="bg-gray-800/80 backdrop-blur-sm p-2 rounded-lg mr-3 group-hover:bg-emerald-500/90 transition-all duration-300">
                  <FiClock className="w-5 h-5 text-emerald-400 group-hover:text-white" />
                </div>
                <div>
                  <h5 className="text-gray-300 font-medium">{t.hoursHead}</h5>
                  <p className="text-gray-400 text-sm">{language === 'en' ? displayTimings : 'সকাল ৭:৩০ - দুপুর ১:৩০ (সোম-শনি)'}</p>
                </div>
              </li>
            </ul>

            {/* Social Media */}
            <div className="mt-6 pt-6 border-t border-gray-800">
              <h5 className="text-gray-300 font-medium mb-3">Connect With Us</h5>
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: <FiFacebook className="w-5 h-5" />, href: socialMedia.facebook },
                  { icon: <FiTwitter className="w-5 h-5" />, href: socialMedia.twitter },
                  { icon: <FiInstagram className="w-5 h-5" />, href: socialMedia.instagram },
                  { icon: <FiYoutube className="w-5 h-5" />, href: socialMedia.youtube },
                  { icon: <FaWhatsapp className="w-5 h-5" />, href: socialMedia.whatsapp },
                ].map((social, index) => (
                  social.href && (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-emerald-800/50 border border-emerald-700/50 flex items-center justify-center hover:bg-emerald-500 transition-all duration-300 text-gray-300 hover:text-white"
                      aria-label="Social Link"
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
            <h3 className="text-xl font-semibold text-white mb-4 pb-2 border-b-2 border-emerald-400 inline-block">
              {t.ourLocation}
            </h3>
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
                  <FiMapPin className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h5 className="text-gray-300 font-medium">{t.addressHead}</h5>
                  <p className="text-gray-400 text-sm">{address}</p>
                  <a 
                    href="https://maps.app.goo.gl/example" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-emerald-400 text-xs flex items-center mt-1 hover:underline"
                  >
                    {t.viewMaps} <FiExternalLink className="ml-1" />
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-gray-800/70 backdrop-blur-sm border border-gray-700/50 p-6 rounded-xl shadow-xl hover:bg-gray-800/80 transition-all duration-300">
                  <FiClock className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h5 className="text-gray-300 font-medium">{t.visitingHours}</h5>
                  <p className="text-gray-400 text-sm">{language === 'en' ? 'Monday - Saturday: 8:00 AM - 2:00 PM' : 'সোমবার - শনিবার: সকাল ৮:০০ - দুপুর ২:০০'}</p>
                  <p className="text-gray-400 text-sm">{language === 'en' ? 'Sunday: Closed' : 'রবিবার: বন্ধ'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-700/50 pt-6 text-center">
          <p className="text-gray-400 text-sm mb-2">
            &copy; {currentYear} {schoolName}. {t.allRights}
          </p>
          <p className="text-xs text-gray-500">
            {t.developedBy} <a href="mailto:sahin401099@gmail.com" className="text-emerald-400 hover:underline">Sahin Arman</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;