import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiArrowRight, 
  FiAward, 
  FiBookOpen, 
  FiUsers, 
  FiCalendar, 
  FiMessageCircle,
  FiMessageSquare,
  FiActivity,
  FiMusic,
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiUser,
  FiImage,
  FiTrendingUp,
  FiHome,
  FiStar,
  FiX
} from 'react-icons/fi';
import ImageSlider from '../components/ImageSlider';
import CountUp from '../components/CountUp';
import { GALLERY_IMAGES, GALLERY_CATEGORIES } from '../data/galleryImages';
import { useLanguage } from '../contexts/LanguageContext';

const features = [
  {
    icon: <FiAward className="w-6 h-6 text-emerald-600" />,
    title: 'Academic Excellence',
    description: 'Consistently achieving outstanding results with a focus on holistic education.',
  },
  {
    icon: <FiBookOpen className="w-6 h-6 text-emerald-600" />,
    title: 'Modern Curriculum',
    description: 'Balanced curriculum that nurtures both academic and personal growth.',
  },
  {
    icon: <FiUsers className="w-6 h-6 text-emerald-600" />,
    title: 'Expert Faculty',
    description: 'Dedicated and qualified teachers committed to student success.',
  },
  {
    icon: <FiCalendar className="w-6 h-6 text-emerald-600" />,
    title: 'Holistic Growth',
    description: 'Wide range of extracurricular activities and events.',
  },
];

const statistics = [
  {
    icon: <FiUsers className="w-8 h-8 text-emerald-600" />,
    count: 500,
    suffix: '+',
    label: 'Students',
    labelBn: 'শিক্ষার্থী'
  },
  {
    icon: <FiHome className="w-8 h-8 text-emerald-600" />,
    count: 15,
    suffix: '+',
    label: 'Classrooms',
    labelBn: 'শ্রেণিকক্ষ'
  },
  {
    icon: <FiStar className="w-8 h-8 text-emerald-600" />,
    count: 98,
    suffix: '%',
    label: 'Success Rate',
    labelBn: 'সাফল্যের হার'
  },
  {
    icon: <FiAward className="w-8 h-8 text-emerald-600" />,
    count: 10,
    suffix: '+',
    label: 'Years of Excellence',
    labelBn: 'শ্রেষ্ঠত্বের বছর'
  }
];

const hostelFacilities = [
  {
    icon: <FiHome className="w-8 h-8 text-emerald-600" />,
    title: 'Full-Time Hostel',
    titleBn: 'পূর্ণকালীন হোস্টেল',
    description: 'Comfortable and secure accommodation with 24/7 supervision, study areas, recreational facilities, and comprehensive coaching programs with nutritious meals included for overall development.',
    descriptionBn: '২৪/৭ তত্ত্বাবধান, পড়াশোনার জায়গা, বিনোদনমূলক সুবিধাসহ আরামদায়ক এবং নিরাপদ আবাসন, এবং সামগ্রিক বিকাশের জন্য পুষ্টিকর খাবারসহ ব্যাপক কোচিং প্রোগ্রাম।',
    image: 'https://res.cloudinary.com/dhhzoshz7/image/upload/v1762442837/hostel-dpspaharpur_ekpoxs.jpg',
    features: [
      '24/7 Security & Supervision',
      'Spacious Dormitories',
      'Nutritious Meals',
      'Evening Study Hours',
      'Weekend Activities',
      'Laundry Service'
    ],
    featuresBn: [
      '২৪/৭ নিরাপত্তা ও তত্ত্বাবধান',
      'প্রশস্ত ডরমিটরি',
      'পুষ্টিকর খাবার',
      'সান্ধ্যকালীন পড়াশোনার সময়',
      'সাপ্তাহিক কার্যক্রম',
      'কাপড় ধোয়ার সুবিধা'
    ]
  },
  {
    icon: <FiClock className="w-8 h-8 text-emerald-600" />,
    title: 'Day Hostel',
    titleBn: 'ডে হোস্টেল',
    description: 'Perfect for day scholars with coaching classes, meals, and study support until evening.',
    descriptionBn: 'সন্ধ্যা পর্যন্ত কোচিং ক্লাস, খাবার এবং পড়াশোনার সহায়তাসহ দিবা ছাত্রছাত্রীদের জন্য আদর্শ।',
    image: 'https://res.cloudinary.com/dhhzoshz7/image/upload/v1762442837/hostel-dpspaharpur_ekpoxs.jpg',
    features: [
      'Daily Coaching Classes',
      'Lunch & Snacks',
      'Evening Study Support',
      'Library Access',
      'Supervised Study Hours',
      'Safe & Secure Environment'
    ],
    featuresBn: [
      'নিয়মিত কোচিং ক্লাস',
      'দুপুরের খাবার ও স্ন্যাক্স',
      'সান্ধ্যকালীন পড়াশোনার সহায়তা',
      'গ্রন্থাগার সুবিধা',
      'তত্ত্বাবধানে পড়াশোনার সময়',
      'নিরাপদ ও সুরক্ষিত পরিবেশ'
    ]
  }
];

const translations = {
  en: {
    hero: {
      welcome: 'Welcome to Dina Public School',
      title1: 'Nurturing Minds,',
      title2: 'Building Futures',
      subtitle: 'Providing a world-class education that empowers students to reach their full potential and become leaders of tomorrow.',
      cta: 'Get in Touch'
    },
    notices: {
      title: 'Notice Updates',
      whatsapp_desc: 'Stay updated with the latest school news, events, and important notices through our official WhatsApp group.',
      whatsapp_btn: 'Join WhatsApp Group',
      results_title: 'Examination Results',
      results_desc: 'Access your performance records and marksheets directly from our dedicated result portal.',
      results_btn: 'View Result Portal'
    },
    founder: {
      title: 'Founder\'s Vision',
      name: 'Moulana Sajjad Hossain Kasimi',
      position: 'Founder & Chairman',
      quote: "Education is not just about acquiring knowledge; it's about building character, nurturing values, and empowering the next generation to create a better tomorrow. At DPS, we believe in shaping not just students, but responsible global citizens who will lead with wisdom and compassion.",
      vision: "To create an enlightened society through quality education that combines modern knowledge with moral values and social responsibility."
    },
    about: {
      title: 'Our Journey',
      content: 'Since our establishment in 2008, Dina Public School has been a beacon of educational excellence in the region. Founded on the principles of academic rigor, moral integrity, and social responsibility, we have grown from humble beginnings to become a trusted name in quality education. Our commitment to holistic development and innovative teaching methodologies has consistently produced outstanding results, while our focus on character building has shaped generations of responsible citizens.'
    },
    academics: {
      title: 'Academic Excellence',
      subtitle: 'Nurturing young minds through a balanced curriculum and innovative teaching methodologies',
      curriculum: [
        { level: 'Pre-Primary', desc: 'Play-based learning for cognitive and social skills.' },
        { level: 'Primary', desc: 'Foundational learning with emphasis on literacy.' },
        { level: 'Upper Primary', desc: 'Structured learning with core subjects.' }
      ]
    },
    gallery: {
      title: 'Photo Gallery',
      subtitle: 'Explore our school\'s memorable moments',
      close: 'Close'
    },
    features: [
      { title: 'Academic Excellence', desc: 'Consistently achieving outstanding results with a focus on holistic education.' },
      { title: 'Modern Curriculum', desc: 'Balanced curriculum that nurtures both academic and personal growth.' },
      { title: 'Expert Faculty', desc: 'Dedicated and qualified teachers committed to student success.' },
      { title: 'Holistic Growth', desc: 'Wide range of extracurricular activities and events.' }
    ],
    cta: {
      title: 'Start Your Journey Today',
      subtitle: 'Join our community of learners and achievers. Discover the difference of a Dina Public School education.',
      btn: 'Get in Touch'
    }
  },
  bn: {
    hero: {
      welcome: 'দিনা পাবলিক স্কুলে আপনাকে স্বাগতম',
      title1: 'মেধা বিকাশ,',
      title2: 'ভবিষ্যৎ নির্মাণ',
      subtitle: 'একটি বিশ্বমানের শিক্ষা প্রদান করা যা শিক্ষার্থীদের তাদের পূর্ণ সম্ভাবনায় পৌঁছাতে এবং আগামী দিনের নেতা হতে ক্ষমতায়ন করে।',
      cta: 'যোগাযোগ করুন'
    },
    notices: {
      title: 'নোটিশ আপডেট',
      whatsapp_desc: 'আমাদের অফিসিয়াল হোয়াটসঅ্যাপ গ্রুপের মাধ্যমে লেটেস্ট স্কুলের খবর, ইভেন্ট এবং গুরুত্বপূর্ণ নোটিশের সাথে আপডেট থাকুন।',
      whatsapp_btn: 'হোয়াটসঅ্যাপ গ্রুপে যোগ দিন',
      results_title: 'পরীক্ষার ফলাফল',
      results_desc: 'আমাদের ডেডিকেটেড রেজাল্ট পোর্টাল থেকে সরাসরি আপনার পারফরম্যান্স রেকর্ড এবং মার্কশীট অ্যাক্সেস করুন।',
      results_btn: 'ফলাফল পোর্টাল দেখুন'
    },
    founder: {
      title: 'প্রতিষ্ঠাতার দৃষ্টিভঙ্গি',
      name: 'মাওলানা সাজ্জাদ হোসাইন কাসেমী',
      position: 'প্রতিষ্ঠাতা ও সভাপতি',
      quote: "শিক্ষা শুধু জ্ঞান অর্জনের বিষয় নয়; এটি চরিত্র গঠন, মূল্যবোধ লালন এবং আগামী প্রজন্মকে একটি উন্নত ভবিষ্যৎ গড়ার জন্য সক্ষম করার বিষয়। ডিপিএস-এ আমরা শুধু শিক্ষার্থী নয়, দায়িত্বশীল বিশ্ব নাগরিক গড়ে তোলার বিশ্বাস করি যারা প্রজ্ঞা ও মানবিকতায় নেতৃত্ব দেবে।",
      vision: "আধুনিক জ্ঞানকে নৈতিক মূল্যবোধ ও সামাজিক দায়িত্বের সাথে সমন্বয় করে একটি আলোকিত সমাজ গড়ে তোলাই আমাদের লক্ষ্য।"
    },
    about: {
      title: 'আমাদের যাত্রাপথ',
      content: '২০০৮ সালে প্রতিষ্ঠার পর থেকে, দিনা পাবলিক স্কুল অঞ্চলে শিক্ষার গুণগত মানের একটি মাইলফলক হয়ে দাঁড়িয়েছে। শিক্ষার গুণগত মান, নৈতিক সততা এবং সামাজিক দায়বদ্ধতার নীতির উপর প্রতিষ্ঠিত হয়ে, আমরা অল্প কিছুদিনের মধ্যেই মানসম্মত শিক্ষার ক্ষেত্রে একটি বিশ্বস্ত নামে পরিণত হয়েছি। সামগ্রিক বিকাশ এবং উদ্ভাবনী শিক্ষণ পদ্ধতির প্রতি আমাদের অঙ্গীকার ধারাবাহিকভাবে অসামান্য ফলাফল এনে দিয়েছে, পাশাপাশি চরিত্র গঠনের উপর আমাদের মনোভাব দায়িত্বশীল নাগরিকদের প্রজন্ম গঠনে সহায়ক হয়েছে।'
    },
    academics: {
      title: 'শিক্ষা শ্রেষ্ঠত্ব',
      subtitle: 'ভারসাম্যপূর্ণ পাঠ্যক্রম এবং উদ্ভাবনী শিক্ষাদান পদ্ধতির মাধ্যমে তরুণ মেধা বিকাশ',
      curriculum: [
        { level: 'প্রাক-প্রাথমিক', desc: 'খেলার মাধ্যমে শিখনের মাধ্যমে শিশুর বিকাশ।' },
        { level: 'প্রাথমিক', desc: 'সাক্ষরতা এবং সংখ্যার উপর জোর দিয়ে মৌলিক শিক্ষা।' },
        { level: 'উচ্চ প্রাথমিক', desc: 'মূল বিষয়গুলির সাথে কাঠামোবদ্ধ শিক্ষা।' }
      ]
    },
    gallery: {
      title: 'ফটো গ্যালারি',
      subtitle: 'আমাদের স্কুলের স্মরণীয় মুহূর্তগুলি অন্বেষণ করুন',
      close: 'বন্ধ'
    },
    features: [
      { title: 'অ্যাকাডেমিক শ্রেষ্ঠত্ব', desc: 'সামগ্রিক শিক্ষার উপর ফোকাস সহ ধারাবাহিকভাবে অসামান্য ফলাফল অর্জন করা।' },
      { title: 'আধুনিক পাঠ্যক্রম', desc: 'ভারসাম্যপূর্ণ পাঠ্যক্রম যা একাডেমিক এবং ব্যক্তিগত উভয় বৃদ্ধি লালন করে।' },
      { title: 'বিশেষজ্ঞ অনুষদ', desc: 'শিক্ষার্থীর সাফল্যের জন্য প্রতিশ্রুতিবদ্ধ নিবেদিত এবং যোগ্য শিক্ষক।' },
      { title: 'সামগ্রিক বৃদ্ধি', desc: 'পাঠ্যবহির্ভূত ক্রিয়াকলাপ এবং ইভেন্টগুলির বিস্তৃত পরিসর।' }
    ],
    cta: {
      title: 'আজই আপনার যাত্রা শুরু করুন',
      subtitle: 'আমাদের শিক্ষার্থী এবং অর্জনকারীদের সম্প্রদায়ে যোগ দিন। একটি দিনা পাবলিক স্কুল শিক্ষার পার্থক্য আবিষ্কার করুন।',
      btn: 'যোগাযোগ করুন'
    }
  }
};

const HomePage = () => {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Transform gallery images for the slider
  const sliderImages = GALLERY_IMAGES.map(img => ({
    image: img.url,
    title: img.title,
    description: img.description
  }));

  const openLightbox = (index) => {
    setSelectedImage(GALLERY_IMAGES[index]);
    setCurrentIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const navigateImage = (direction) => {
    let newIndex;
    if (direction === 'prev') {
      newIndex = (currentIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
    } else {
      newIndex = (currentIndex + 1) % GALLERY_IMAGES.length;
    }
    setSelectedImage(GALLERY_IMAGES[newIndex]);
    setCurrentIndex(newIndex);
  };

  return (
    <div className="overflow-x-hidden">
      {/* Custom CSS for smooth scrolling and animations */}
      <style jsx="true" global="true">{`
        /* Smooth scrolling for entire page */
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #10b981;
          border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #059669;
        }
        
        @keyframes scroll-x {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll-x {
          animation: scroll-x 25s linear infinite;
          width: fit-content;
        }
        
        /* Pause animation on hover */
        .animate-scroll-x:hover {
          animation-play-state: paused;
        }
        
        /* Ensure smooth scrolling */
        .gallery-wrapper {
          overflow: hidden;
          white-space: nowrap;
        }
        
        /* Remove default margin for body */
        body {
          margin: 0;
          padding: 0;
        }
      `}</style>
      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-28 pb-12 sm:pb-20 md:pt-36 md:pb-32 bg-[#064e3b] text-white overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [0, 50, 0],
              y: [0, 30, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-24 -left-24 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-emerald-600/20 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
              x: [0, -40, 0],
              y: [0, -50, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-24 -right-24 w-56 sm:w-64 md:w-80 h-56 sm:h-64 md:h-80 bg-green-600/20 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12">
            <div className="w-full lg:w-1/2 text-center lg:text-left order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block py-1 px-3 sm:px-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-medium mb-3 sm:mb-6">
                  {t.hero.welcome}
                </span>
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-6xl font-bold mb-3 sm:mb-6 leading-tight">
                  {t.hero.title1} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400">
                    {t.hero.title2}
                  </span>
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 lg:mb-8 text-emerald-100/70 max-w-md sm:max-w-lg lg:max-w-2xl mx-auto lg:mx-0">
                  {t.hero.subtitle}
                </p>
                <div className="flex justify-center lg:justify-start">
                  <a 
                    href="#contact" 
                    className="px-5 py-2.5 sm:px-6 sm:py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg sm:rounded-xl font-semibold transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 text-sm sm:text-base"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {t.hero.cta} <FiArrowRight />
                  </a>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              className="w-full lg:w-1/2 order-1 lg:order-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative p-2 bg-white/5 rounded-xl sm:rounded-2xl lg:rounded-3xl border border-white/10 backdrop-blur-sm shadow-2xl">
                <ImageSlider images={sliderImages} autoPlay={true} interval={5000} height="250px" className="rounded-lg sm:rounded-xl lg:rounded-2xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Notices and Results Highlights Section */}
      <section className="py-12 sm:py-16 bg-emerald-50/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* WhatsApp Group Card */}
            <motion.div 
              className="group relative bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border border-emerald-100 overflow-hidden"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-emerald-500/5 rounded-bl-full -mr-6 sm:-mr-10 -mt-6 sm:-mt-10 group-hover:bg-emerald-500/10 transition-colors" />
              <div className="flex items-start gap-4 sm:gap-6 relative z-10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-100 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 text-emerald-600">
                  <FiMessageCircle className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">{t.notices.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{t.notices.whatsapp_desc}</p>
                  <a 
                    href="https://chat.whatsapp.com/GUPT_WHATSAPP_LINK" // Replace with actual link
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 py-2.5 sm:py-3 px-4 sm:px-6 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-lg sm:rounded-xl font-bold transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
                  >
                    {t.notices.whatsapp_btn}
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Results Card */}
            <motion.div 
              className="group relative bg-[#064e3b] p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl overflow-hidden text-white"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-emerald-500/5 rounded-bl-full -mr-6 sm:-mr-10 -mt-6 sm:-mt-10" />
              <div className="flex items-start gap-4 sm:gap-6 relative z-10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 text-emerald-400">
                  <FiAward className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-2xl font-bold mb-2">{t.notices.results_title}</h3>
                  <p className="text-sm sm:text-base text-emerald-100/70 mb-4 sm:mb-6">{t.notices.results_desc}</p>
                  <a 
                    href="https://marks-mint-dps-paharpur-web.vercel.app/" // Updated link
                    target="_blank"
                    className="inline-flex items-center gap-2 py-2.5 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-lg sm:rounded-xl font-bold transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
                  >
                    {t.notices.results_btn} <FiArrowRight />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  <CountUp end={stat.count} suffix={stat.suffix} duration={2} />
                </div>
                <p className="text-sm md:text-base text-gray-600 font-medium">
                  {language === 'bn' ? stat.labelBn : stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hostel Facilities Section */}
      <section className="py-20 bg-emerald-50/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {language === 'bn' ? 'হোস্টেল সুবিধা' : 'Hostel Facilities'}
            </h2>
            <div className="w-20 h-1 bg-emerald-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'bn' 
                ? 'আমাদের আবাসিক সুবিধাগুলি শিক্ষার্থীদের জন্য একটি আরামদায়ক এবং নিরাপদ পরিবেশ নিশ্চিত করে' 
                : 'Our residential facilities provide a comfortable and secure environment for students to thrive'
              }
            </p>
          </div>
          
          {/* Hostel Image */}
          <div className="mb-12 max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl">
            <img 
              src="https://res.cloudinary.com/dhhzoshz7/image/upload/v1762442837/hostel-dpspaharpur_ekpoxs.jpg" 
              alt={language === 'bn' ? 'আমাদের হোস্টেলের ভিতরের দৃশ্য' : 'Our Hostel Interior'}
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {hostelFacilities.map((facility, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-emerald-50 hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mr-4">
                      {facility.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {language === 'bn' ? facility.titleBn : facility.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-6">
                    {language === 'bn' ? facility.descriptionBn : facility.description}
                  </p>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    {language === 'bn' ? 'সুবিধাসমূহ' : 'Facilities'}
                  </h4>
                  <ul className="space-y-2">
                    {(language === 'bn' ? facility.featuresBn : facility.features).map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <svg className="h-5 w-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.gallery.title}</h2>
            <div className="w-20 h-1 bg-emerald-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t.gallery.subtitle}</p>
          </div>
          
          {/* Horizontal Scrolling Gallery */}
          <div className="gallery-wrapper">
            <div className="flex gap-6 animate-scroll-x">
              {/* Duplicate images for seamless loop */}
              {[...GALLERY_IMAGES, ...GALLERY_IMAGES].map((image, index) => (
                <motion.div
                  key={`${image.url}-${index}`}
                  className="flex-shrink-0 w-80 h-60 group rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5 }}
                  onClick={() => openLightbox(index % GALLERY_IMAGES.length)}
                >
                  <>
                    <img 
                      src={image.thumbnail || image.url} 
                      alt={image.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <div className="text-white">
                        <p className="text-sm font-bold">{image.title}</p>
                        <FiImage className="mt-1" />
                      </div>
                    </div>
                  </>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Us / Founder Section */}
      <section className="py-20 bg-emerald-50/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-full min-h-[500px]"
            >
              <img 
                src="https://res.cloudinary.com/dhhzoshz7/image/upload/v1757213988/founder2_lhc5ha.jpg" 
                alt={t.founder.name}
                className="w-full h-full object-cover rounded-2xl shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 sm:p-6 rounded-2xl">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/5 backdrop-blur-sm p-4 sm:p-5 rounded-xl border border-white/10 shadow-lg w-full max-w-[90%] mx-auto mb-4 sm:mb-8"
                >
                  <p className="text-white/90 italic text-sm sm:text-base md:text-lg leading-relaxed mb-3 sm:mb-4">"{t.founder.vision}"</p>
                  <div className="pt-3 sm:pt-4 border-t border-white/10">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-white">{t.founder.name}</h3>
                    <p className="text-emerald-300 font-medium text-sm sm:text-base">{t.founder.position}</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">{t.founder.title}</h2>
                <div className="w-20 h-1 bg-emerald-600 mb-8"></div>
                
                <div className="relative pl-6 mb-8 border-l-4 border-emerald-100">
                  <FiMessageSquare className="absolute -left-8 top-0 text-4xl text-emerald-100" />
                  <p className="text-xl text-gray-700 italic leading-relaxed">
                    "{t.founder.quote}"
                  </p>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="p-8 bg-gradient-to-br from-emerald-50 to-white rounded-2xl border border-emerald-50 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <h4 className="text-2xl font-bold text-emerald-800 mb-4 flex items-center">
                    <FiBookOpen className="mr-3 text-emerald-600" />
                    {t.about.title}
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {t.about.content}
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Academics Section */}
      <section id="academics" className="py-20 bg-gray-50/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.academics.title}</h2>
            <div className="w-20 h-1 bg-emerald-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t.academics.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.academics.curriculum.map((item, index) => (
              <motion.div 
                key={index}
                className="bg-white p-8 rounded-3xl shadow-lg border border-emerald-50 hover:border-emerald-200 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 text-emerald-600">
                  <FiBookOpen size={24} />
                </div>
                <h3 className="text-xl font-bold mb-4">{item.level}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <button className="absolute top-6 right-6 text-white text-3xl p-2 hover:bg-white/10 rounded-full transition-colors" onClick={closeLightbox}>
              <FiX />
            </button>
            <motion.div 
              className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={selectedImage.url} alt={selectedImage.title} className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl" />
              <div className="mt-6 text-center text-white">
                <h3 className="text-2xl font-bold">{selectedImage.title}</h3>
                <p className="text-emerald-400 mt-2">{selectedImage.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-emerald-600 to-green-700 rounded-[2rem] p-10 md:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full fill-white">
                <path d="M0 0 L100 0 L100 100 Z" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">{t.cta.title}</h2>
            <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto relative z-10">
              {t.cta.subtitle}
            </p>
            <div className="flex justify-center gap-4 relative z-10">
              <a 
                href="https://wa.me/916295884463" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white text-emerald-700 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-xl flex items-center gap-2"
              >
                <FiMessageSquare className="text-xl" />
                {t.cta.btn}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;