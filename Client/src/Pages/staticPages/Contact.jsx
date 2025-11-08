import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaWhatsapp, 
  FaPhoneAlt, 
  FaMapMarkerAlt, 
  FaClock,
  FaEnvelope
} from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import useSchoolInfo from '../../hooks/useSchoolInfo';

const translations = {
  en: {
    title: 'Contact Us',
    subtitle: 'Do you have any questions or feedback? We would love to hear from you.',
    whatsapp: 'WhatsApp',
    sendMessage: 'Send Message',
    callUs: 'Call Us',
    callNow: 'Call Now',
    emailUs: 'Email Us',
    sendEmail: 'Send Email',
    visitUs: 'Visit Us',
    viewMap: 'View on Map',
    ourLocation: 'Our Location',
    hours: {
      weekdays: 'Monday - Friday: 9:00 AM - 4:00 PM',
      saturday: 'Saturday: 9:00 AM - 1:00 PM',
      sunday: 'Sunday: Closed'
    }
  },
  bn: {
    title: 'যোগাযোগ করুন',
    subtitle: 'আপনার কোন প্রশ্ন বা মতামত আছে? আমরা আপনার কাছ থেকে শুনতে আগ্রহী।',
    whatsapp: 'হোয়াটসঅ্যাপ',
    sendMessage: 'মেসেজ পাঠান',
    callUs: 'কল করুন',
    callNow: 'এখন কল করুন',
    emailUs: 'ইমেল করুন',
    sendEmail: 'ইমেল পাঠান',
    visitUs: 'ভিজিট করুন',
    viewMap: 'ম্যাপে দেখুন',
    ourLocation: 'আমাদের ঠিকানা',
    hours: {
      weekdays: 'সোমবার - শুক্রবার: সকাল ৯টা - বিকাল ৪টা',
      saturday: 'শনিবার: সকাল ৯টা - দুপুর ১টা',
      sunday: 'রবিবার: বন্ধ'
    }
  }
};

export default function Contact() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  const school = useSchoolInfo();

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="pt-24 pb-12 md:pt-28 md:pb-16 lg:pt-32 lg:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4"
        >
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {t.title}
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto mb-4 rounded-full"></div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {/* WhatsApp Card */}
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                whileHover={{ y: -5 }}
              >
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <FaWhatsapp className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {t.whatsapp}
                </h4>
                <p className="text-gray-600 text-sm mb-4 font-medium">
                  {school.contact.whatsapp}
                </p>
                <a 
                  href={`https://wa.me/${school.contact.whatsapp.replace(/\D/g, '')}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors w-full"
                >
                  <FaWhatsapp className="w-4 h-4 mr-2" />
                  {t.sendMessage}
                </a>
              </motion.div>

              {/* Email Card */}
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                whileHover={{ y: -5 }}
              >
                <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <FaEnvelope className="w-5 h-5 text-amber-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {t.emailUs}
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  dinapublicschool@gmail.com
                </p>
                <a 
                  href="mailto:dinapublicschool@gmail.com"
                  className="inline-flex items-center justify-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors w-full"
                >
                  <FaEnvelope className="w-4 h-4 mr-2" />
                  {t.sendEmail}
                </a>
              </motion.div>

              {/* Call Card */}
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                whileHover={{ y: -5 }}
              >
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <FaPhoneAlt className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {t.callUs}
                </h4>
                <p className="text-gray-600 text-sm mb-4 font-medium">
                  {school.contact.primaryPhone}
                </p>
                <a 
                  href={`tel:${school.contact.primaryPhone.replace(/\D/g, '')}`}
                  className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors w-full"
                >
                  <FaPhoneAlt className="w-3 h-3 mr-2" />
                  {t.callNow}
                </a>
              </motion.div>

              {/* Visit Card */}
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                whileHover={{ y: -5 }}
              >
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <FaMapMarkerAlt className="w-5 h-5 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {t.visitUs}
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  {language === 'en' 
                    ? ` ${school.address.village}, ${school.address.block}, ${school.address.district}, ${school.address.state} - ${school.address.pincode}, ${school.address.country}`
                    : `${school.address.village}, ${school.address.block}, ${school.address.district}, ${school.address.state} - ${school.address.pincode}, ${school.address.country}`
                  }
                </p>
                <a 
                  href="https://maps.google.com"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors w-full"
                >
                  <FaMapMarkerAlt className="w-3 h-3 mr-2" />
                  {t.viewMap}
                </a>
              </motion.div>
            </div>

            {/* Map Card */}
            <motion.div 
              className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="h-96 w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3619.002888183759!2d88.341211!3d25.3075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDE4JzI3LjEiTiA4OMKwMjAnNDguNiJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin&z=13&ll=25.3075,88.341211&output=embed"
                  width="100%"
                  height="100%"
                  className="border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="School Location"
                  aria-label="Interactive map showing school location"
                />
              </div>
              <div className="p-6">
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  {t.ourLocation}
                </h4>
                <p className="text-gray-600 mb-4">
                  {language === 'en' 
                    ? `${school.address.street}, ${school.address.village}, ${school.address.block}, ${school.address.district}, ${school.address.state} - ${school.address.pincode}, ${school.address.country}`
                    : `${school.address.village}, ${school.address.block}, ${school.address.district}, ${school.address.state} - ${school.address.pincode}, ${school.address.country}`
                  }
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <FaClock className="w-4 h-4 mr-2" />
                    <span>{t.hours.weekdays}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <FaClock className="w-4 h-4 mr-2" />
                    <span>{t.hours.saturday}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <FaClock className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="line-through">{t.hours.sunday}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
