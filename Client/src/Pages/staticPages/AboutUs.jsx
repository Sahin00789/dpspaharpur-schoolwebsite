import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiArrowRight, 
  FiAward, 
  FiBookOpen, 
  FiUsers, 
  FiCalendar, 
  FiMapPin, 
  FiPhone, 
  FiMail, 
  FiClock, 
  FiHome, 
  FiUser, 
  FiMessageSquare, 
  FiMusic, 
  FiActivity 
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../../contexts/LanguageContext';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

// Translations
const translations = {
  en: {
    learningApproach: {
      title: 'Our Learning Approach',
      subtitle: 'A balanced approach that combines academic rigor with creative and practical learning',
      items: [
        {
          title: 'Student-Centered',
          description: 'Interactive classroom sessions with hands-on activities and practical demonstrations',
          icon: 'FiUsers'
        },
        {
          title: 'Experiential Learning',
          description: 'Laboratory work, field trips, and real-world applications of concepts',
          icon: 'FiActivity'
        },
        {
          title: 'Holistic Development',
          description: 'Music, arts, sports, and clubs for well-rounded education',
          icon: 'FiMusic'
        }
      ]
    },
    assessment: {
      title: 'Assessment & Evaluation',
      subtitle: 'Our comprehensive evaluation system ensures continuous assessment and holistic development of every student.',
      sections: [
        {
          title: 'Continuous Assessment',
          items: [
            'Regular class tests and quizzes',
            'Project work and presentations',
            'Practical and oral assessments'
          ]
        },
        {
          title: 'Holistic Development',
          items: [
            'Co-scholastic activities evaluation',
            'Life skills and value education',
            'Regular parent-teacher meetings'
          ]
        }
      ]
    },
    hostel: {
      title: 'Hostel Facility',
      subtitle: 'Safe and comfortable boarding for students with modern amenities and 24/7 care',
      featuresTitle: 'Our Hostel Features',
      features: [
        'Spacious and well-ventilated rooms with attached bathrooms',
        'Nutritious and hygienic meals (breakfast, lunch, evening snacks, and dinner)',
        '24/7 security and CCTV surveillance',
        'Dedicated study hours with supervised tutoring',
        'Recreational facilities and indoor games',
        'Regular health check-ups and medical facilities',
        'Laundry and housekeeping services',
        'Wi-Fi enabled study areas'
      ],
      contact: {
        title: 'For More Information',
        subtitle: 'Contact our hostel warden for admission details and fees:',
        phone: '+91 XXXXXXXXXX',
        phoneLink: 'tel:+91XXXXXXXXXX',
        email: 'hostel@dpspaharpur.edu.in'
      },
      imageTitle: 'Comfortable Living Spaces',
      imageSubtitle: 'Designed for both study and relaxation'
    },
    campuses: {
      title: 'Our Campuses',
      subtitle: 'Explore our network of campuses, each providing excellent education and facilities.'
    },
    hero: {
      title: 'About Our School',
      subtitle: 'Nurturing young minds for a brighter tomorrow'
    },
    founder: {
      title: 'Message from Our Founder',
      subtitle: 'Guiding principles and vision that shape our educational philosophy',
      name: 'Moulana Sajjad Hossain Kasimi',
      position: 'Founder & Chairman',
      description: 'A visionary educator and social reformer dedicated to transforming lives through quality education',
      quote: "Education is not just about acquiring knowledge; it's about building character, nurturing values, and empowering the next generation to create a better tomorrow. At Dina Public School, we are committed to providing an education that enlightens minds and enriches souls.",
      signature: "Moulana Sajjad Hossain Kasimi\nFounder, Dina Public School"
    },
    about: {
      title: 'Our Story',
      content: 'Established in 2008, DPS was founded on the principles of academic excellence, moral integrity, and social responsibility. We provide a nurturing environment where every child can discover their potential and develop into well-rounded individuals.'
    },
    keyPoints: [
      {
        id: 1,
        title: 'Our Foundation',
        content: 'Established in 2008, DPS was founded on the principles of academic excellence, moral integrity, and social responsibility.'
      },
      {
        id: 2,
        title: 'Our Commitment',
        content: 'We provide a nurturing environment where every child can discover their potential and develop into well-rounded individuals.'
      }
    ],
    academic: {
      title: 'Academic Excellence',
      subtitle: 'Nurturing young minds through a balanced curriculum and innovative teaching methodologies'
    },
    contact: 'Contact Us',
    address: 'Address',
    phone: 'Phone',
    email: 'Email',
    hours: 'Working Hours',
    viewDetails: 'View Details',
    stats: {
      students: 'Students Enrolled',
      teachers: 'Qualified Teachers',
      success: 'Academic Success',
      years: 'Years of Excellence'
    },
    founderQuote: "The beautiful thing about learning is that no one can take it away from you. At Dina Public School, we don't just teach students how to make a living; we teach them how to live a meaningful life."
  },
  bn: {
    learningApproach: {
      title: 'আমাদের শিখন পদ্ধতি',
      subtitle: 'একটি ভারসাম্যপূর্ণ পদ্ধতি যা একাডেমিক কঠোরতাকে সৃজনশীল এবং ব্যবহারিক শিক্ষার সাথে একত্রিত করে',
      items: [
        {
          title: 'শিক্ষার্থী-কেন্দ্রিক',
          description: 'হাতেকলমে কার্যকলাপ এবং ব্যবহারিক প্রদর্শনী সহ ইন্টারেক্টিভ ক্লাসরুম সেশন',
          icon: 'FiUsers'
        },
        {
          title: 'অনুভবমূলক শিক্ষা',
          description: 'ল্যাবরেটরি কাজ, ফিল্ড ট্রিপ এবং ধারণাগুলির বাস্তব-বিশ্বের প্রয়োগ',
          icon: 'FiActivity'
        },
        {
          title: 'সামগ্রিক উন্নয়ন',
          description: 'সুসংগত শিক্ষার জন্য সঙ্গীত, শিল্প, খেলাধুলা এবং ক্লাব',
          icon: 'FiMusic'
        }
      ]
    },
    assessment: {
      title: 'মূল্যায়ন ও মূল্যায়ন',
      subtitle: 'আমাদের বিস্তৃত মূল্যায়ন ব্যবস্থা প্রতিটি শিক্ষার্থীর ধারাবাহিক মূল্যায়ন এবং সামগ্রিক বিকাশ নিশ্চিত করে।',
      sections: [
        {
          title: 'ধারাবাহিক মূল্যায়ন',
          items: [
            'নিয়মিত ক্লাস টেস্ট এবং কুইজ',
            'প্রকল্পের কাজ এবং উপস্থাপনা',
            'ব্যবহারিক এবং মৌখিক মূল্যায়ন'
          ]
        },
        {
          title: 'সামগ্রিক উন্নয়ন',
          items: [
            'সহ-শিক্ষামূলক কার্যক্রম মূল্যায়ন',
            'জীবন দক্ষতা এবং মূল্যবোধ শিক্ষা',
            'নিয়মিত অভিভাবক-শিক্ষক বৈঠক'
          ]
        }
      ]
    },
    hostel: {
      title: 'ছাত্রাবাস সুবিধা',
      subtitle: 'আধুনিক সুযোগ-সুবিধা এবং 24/7 যত্ন সহ শিক্ষার্থীদের জন্য নিরাপদ এবং আরামদায়ক আবাসন',
      featuresTitle: 'আমাদের ছাত্রাবাসের বৈশিষ্ট্য',
      features: [
        'সংযুক্ত বাথরুম সহ প্রশস্ত এবং ভালো বায়ুচলাচলযুক্ত কক্ষ',
        'পুষ্টিকর এবং স্বাস্থ্যকর খাবার (সকালের নাস্তা, দুপুরের খাবার, সন্ধ্যার নাস্তা এবং রাতের খাবার)',
        '24/7 নিরাপত্তা এবং সিসিটিভি নজরদারি',
        'পরিচালিত টিউটরিং সহ নিবেদিত অধ্যয়নের সময়',
        'বিনোদনমূলক সুবিধা এবং ইনডোর গেমস',
        'নিয়মিত স্বাস্থ্য পরীক্ষা এবং চিকিৎসা সুবিধা',
        'লন্ড্রি এবং হাউজকিপিং পরিষেবা',
        'ওয়াই-ফাই সক্ষম অধ্যয়ন এলাকা'
      ],
      contact: {
        title: 'আরও তথ্যের জন্য',
        subtitle: 'ভর্তি সংক্রান্ত বিস্তারিত এবং ফি জানতে আমাদের হোস্টেল ওয়ার্ডেনের সাথে যোগাযোগ করুন:',
        phone: '+৯১ XXXXXXXXXX',
        phoneLink: 'tel:+91XXXXXXXXXX',
        email: 'hostel@dpspaharpur.edu.in'
      },
      imageTitle: 'আরামদায়ক বসবাসের স্থান',
      imageSubtitle: 'অধ্যয়ন এবং বিশ্রাম উভয়ের জন্যই ডিজাইন করা হয়েছে'
    },
    campuses: {
      title: 'আমাদের ক্যাম্পাসসমূহ',
      subtitle: 'আমাদের ক্যাম্পাস নেটওয়ার্কটি অন্বেষণ করুন, প্রতিটি উৎকৃষ্ট শিক্ষা এবং সুবিধা প্রদান করে।'
    },
    hero: {
      title: 'আমাদের সম্পর্কে',
      subtitle: 'উজ্জ্বল ভবিষ্যতের জন্য তরুণ মেধাদের গড়ে তোলা'
    },
    founder: {
      title: 'আমাদের প্রতিষ্ঠাতার বার্তা',
      subtitle: 'আমাদের শিক্ষাগত দর্শনকে রূপদানকারী নির্দেশমূলক নীতি এবং দৃষ্টিভঙ্গি',
      name: 'মাওলানা সাজ্জাদ হোসাইন কাসেমী',
      position: 'Founder & Chairman',
      description: '',
      quote: "শিক্ষা শুধু জ্ঞান অর্জনের বিষয় নয়; এটি চরিত্র গঠন, মূল্যবোধ লালন এবং আগামী প্রজন্মকে একটি ভালো আগামী গড়ে তোলার ক্ষমতা প্রদান করা। দিনা পাবলিক স্কুলে, আমরা এমন একটি শিক্ষা প্রদানের জন্য প্রতিশ্রুতিবদ্ধ যা মনকে আলোকিত করে এবং আত্মাকে সমৃদ্ধ করে।",
      signature: 'মাওলানা সাজ্জাদ হোসাইন কাসেমী\nFounder, Dina Public School'
    },
    about: {
      title: 'আমাদের গল্প',
      content: 'গুণগত শিক্ষা প্রদানের লক্ষ্যে প্রতিষ্ঠিত, আমাদের স্কুল বছরের পর বছর ধরে একাডেমিক শ্রেষ্ঠত্ব ও চরিত্র গঠনের কেন্দ্রবিন্দু হয়ে আছে। আমরা সামগ্রিক বিকাশে বিশ্বাস করি যা প্রতিটি শিক্ষার্থীর বুদ্ধিবৃত্তিক, মানসিক এবং সামাজিক বিকাশকে গড়ে তোলে।'
    },
    keyPoints: [
      {
        id: 1,
        title: 'আমাদের ভিত্তি',
        content: '২০০৮ সালে প্রতিষ্ঠিত, ডিপিএস শিক্ষার গুণগত মান, নৈতিক সততা এবং সামাজিক দায়বদ্ধতার নীতির উপর প্রতিষ্ঠিত।'
      },
      {
        id: 2,
        title: 'আমাদের অঙ্গীকার',
        content: 'আমরা একটি লালনপালনের পরিবেশ প্রদান করি যেখানে প্রতিটি শিশু তার সম্ভাবনা আবিষ্কার করতে পারে এবং সুসঙ্গত ব্যক্তিত্বে বিকশিত হতে পারে।'
      }
    ],
    academic: {
      title: 'শিক্ষাগত শ্রেষ্ঠত্ব',
      subtitle: 'সুষম পাঠ্যক্রম এবং উদ্ভাবনী শিক্ষাদান পদ্ধতির মাধ্যমে তরুণ মস্তিষ্ককে লালন করা'
    },
    mission: {
      title: 'আমাদের লক্ষ্য',
      content: 'শিক্ষার্থীদের জ্ঞান, দক্ষতা এবং মূল্যবোধ দিয়ে সজ্জিত করা যাতে তারা আগামীর চ্যালেঞ্জগুলির জন্য প্রস্তুত হয় এবং আমাদের সাংস্কৃতিক ঐতিহ্যের সাথে যুক্ত থাকে।'
    },
    vision: {
      title: 'আমাদের দৃষ্টিভঙ্গি',
      content: 'উদ্ভাবনী শিক্ষা এবং শক্তিশালী নৈতিক মূল্যবোধের মাধ্যমে ভবিষ্যতের নেতৃত্ব গড়ে তোলার একটি শ্রেষ্ঠত্বের কেন্দ্র হওয়া।'
    },
    programs: 'শিক্ষামূলক কর্মসূচি',
    contact: 'যোগাযোগ করুন',
    address: 'ঠিকানা',
    phone: 'ফোন',
    email: 'ইমেইল',
    hours: 'কর্মঘণ্টা',
    viewDetails: 'বিস্তারিত দেখুন',
    admissionBtn: 'ভর্তি চলছে',
    stats: {
      students: 'শিক্ষার্থী',
      teachers: 'দক্ষ শিক্ষক',
      success: 'শিক্ষাগত সাফল্য',
      years: 'সাফল্যের বছর'
    },
    founderQuote: "শেখার সবচেয়ে সুন্দর দিক হলো এটা কেউ কেড়ে নিতে পারে না। দিনা পাবলিক স্কুলে, আমরা শুধু শিক্ষার্থীদের জীবিকা অর্জনের উপায় শেখাই না; আমরা তাদের অর্থপূর্ণ জীবনযাপনের পথ দেখাই।"
  }
};

// Campuses data
const campuses = [
  { 
    name: 'পাহাড়পুর', 
    path: '/campuses/paharpur', 
    address: 'পাহাড়পুর, বংশিহারী, দক্ষিণ দিনাজপুর',
    phone: '+৯১ ১২৩৪৫৬৭৮৯০',
    email: 'paharpur@dps.edu',
    hours: 'সোম-শনি: সকাল ৮টা - বিকাল ৪টা',
    imageUrl: 'https://res.cloudinary.com/dhhzoshz7/image/upload/v1762345248/paharpur_b07ijs.jpg'
  },
  { 
    name: 'মিরাকুড়ি', 
    path: '/campuses/mirakuri', 
    address: 'মিরাকুড়ি, বংশিহারী, দক্ষিণ দিনাজপুর',
    phone: '+৯১ ১২৩৪৫৬৭৮৯১',
    email: 'mirakuri@dps.edu',
    hours: 'সোম-শনি: সকাল ৮টা - বিকাল ৪টা',
    imageUrl: 'https://res.cloudinary.com/dhhzoshz7/image/upload/v1762345129/mirakuri_ob3eo4.jpg'
  },
  { 
    name: 'মাদ্রাসা', 
    path: '/campuses/madrasha', 
    address: 'মিরাকুড়ি, বংশিহারী, দক্ষিণ দিনাজপুর',
    phone: '+৯১ ১২৩৪৫৬৭৮৯২',
    email: 'madrasha@dps.edu',
    hours: 'সোম-শনি: সকাল ৮টা - বিকাল ৪টা',
    imageUrl: 'https://res.cloudinary.com/dhhzoshz7/image/upload/v1762345150/Madrasha_il8lbo.jpg'
  },
  { 
    name: 'আমরুলবাড়ি', 
    path: '/campuses/amrulbari', 
    address: 'আমরুলবাড়ি, তপন, দক্ষিণ দিনাজপুর',
    phone: '+৯১ ১২৩৪৫৬৭৮৯৩',
    email: 'amrulbari@dps.edu',
    hours: 'সোম-শনি: সকাল ৮টা - বিকাল ৪টা',
    imageUrl: 'https://res.cloudinary.com/dhhzoshz7/image/upload/v1762345135/bolla_jyy6au.jpg'
  },
];

// Academic programs with improved content and consistent icons
const academicPrograms = {
  en: [
    {
      level: 'Pre-Primary (LKG & UKG)',
      description: 'Play-based learning to develop cognitive, social, and motor skills',
      icon: <FiActivity className="w-6 h-6 text-emerald-600" />,
      features: ['Phonics & Language Development', 'Pre-Math Concepts', 'Sensory Activities']
    },
    {
      level: 'Primary (I - V)',
      description: 'Foundational learning with emphasis on literacy and numeracy',
      icon: <FiBookOpen className="w-6 h-6 text-emerald-600" />,
      features: ['Language Skills', 'Mathematics', 'Environmental Studies']
    },
    {
      level: 'Upper Primary (VI - VIII)',
      description: 'Structured learning with introduction to core subjects',
      icon: <FiUsers className="w-6 h-6 text-emerald-600" />,
      features: ['Science', 'Mathematics', 'Social Studies']
    }
  ],
  bn: [
    {
      level: 'প্রাক-প্রাথমিক (এলকেজি ও ইউকে্জি)',
      description: 'জ্ঞানীয়, সামাজিক এবং শারীরিক দক্ষতা বিকাশের জন্য খেলার মাধ্যমে শিখন',
      icon: <FiActivity className="w-6 h-6 text-emerald-600" />,
      features: ['ধ্বনি ও ভাষা বিকাশ', 'প্রাক-গণিত ধারণা', 'সংবেদনশীল কার্যক্রম']
    },
    {
      level: 'প্রাথমিক (১ম - ৫ম শ্রেণি)',
      description: 'সাক্ষরতা এবং সংখ্যাগত দক্ষতার উপর জোর দিয়ে মৌলিক শিক্ষা',
      icon: <FiBookOpen className="w-6 h-6 text-emerald-600" />,
      features: ['ভাষা দক্ষতা', 'গণিত', 'পরিবেশ অধ্যয়ন']
    },
    {
      level: 'উচ্চ প্রাথমিক (৬ষ্ঠ - ৮ম শ্রেণি)',
      description: 'মূল বিষয়গুলির সাথে পরিচয় করিয়ে দিয়ে কাঠামোবদ্ধ শিক্ষা',
      icon: <FiUsers className="w-6 h-6 text-emerald-600" />,
      features: ['বিজ্ঞান', 'গণিত', 'সামাজিক বিজ্ঞান']
    }
  ]
};

// Stats data
const stats = (t) => [
  { value: '1000+', label: t.stats.students, icon: <FiUsers className="w-8 h-8 text-green-600" /> },
  { value: '50+', label: t.stats.teachers, icon: <FiUser className="w-8 h-8 text-green-600" /> },
  { value: '95%', label: t.stats.success, icon: <FiAward className="w-8 h-8 text-green-600" /> },
  { value: '15+', label: t.stats.years, icon: <FiCalendar className="w-8 h-8 text-green-600" /> },
];

function AboutUs() {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = React.useState(true);
  
  // Debug logging
  React.useEffect(() => {
    console.log('Language changed to:', language);
    console.log('Current translations:', translations[language]?.academic);
  }, [language]);
  
  const t = translations[language] || translations.en;
  const currentPrograms = academicPrograms[language] || academicPrograms.en;
  const currentStats = stats(t);

  React.useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAdmissionClick = () => {
    toast.success(language === 'bn' ? 'ভর্তি পৃষ্ঠায় রিডাইরেক্ট করা হচ্ছে...' : 'Redirecting to admission page...');
  };

  // Set document direction based on language
  React.useEffect(() => {
    document.documentElement.dir = language === 'bn' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white pt-24 ${language === 'bn' ? 'font-bangla' : ''}`}>
      {/* Founder's Message */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <motion.h2 
              className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 ${language === 'bn' ? 'font-sans' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {t.founder.title}
            </motion.h2>
            <div className="w-20 h-1 bg-green-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.founder.subtitle}
            </p>
          </div>
          
          <motion.div 
            className="relative bg-white rounded-2xl shadow-xl overflow-hidden max-w-6xl mx-auto border border-gray-100"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Founder's Image */}
              <div className="relative h-full min-h-[400px] lg:min-h-[500px]">
                <img 
                  src="https://res.cloudinary.com/dhhzoshz7/image/upload/v1757213988/founder2_lhc5ha.jpg" 
                  alt="Moulana Sajjad Hossain Kasimi, Founder"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-end p-8 lg:p-10">
                  <div className="text-white">
                    <h3 className={`text-2xl md:text-3xl font-bold mb-2 ${language === 'bn' ? 'font-sans' : ''}`}>{t.founder.name}</h3>
                    <p className="text-yellow-300 text-lg font-medium mb-4">{t.founder.position}</p>
                    <div className="w-16 h-1 bg-yellow-400 mb-4"></div>
                    <p className="text-green-100 max-w-md">
                      {t.founder.description}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Message Content */}
              <div className="p-8 md:p-10">
                <div className="relative h-full flex flex-col">
                  <div className="mb-8">
                    <FiMessageSquare className="text-5xl text-green-100 mb-6" />
                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                      "{t.founder.quote}"
                    </p>
                  </div>
                  
                  <div className="mt-auto space-y-6">
                    {t.keyPoints.map((point, index) => (
                      <div key={point.id} className={`p-6 ${index % 2 === 0 ? 'bg-green-50' : 'bg-yellow-50'} rounded-lg`}>
                        <h4 className="font-semibold text-lg text-gray-900 mb-3 flex items-center">
                          <span className={`w-8 h-8 ${index % 2 === 0 ? 'bg-green-600' : 'bg-yellow-500'} text-white rounded-full flex items-center justify-center mr-3`}>
                            {index + 1}
                          </span>
                          {point.title}
                        </h4>
                        <p className="text-gray-600 pl-11">
                          {point.content}
                        </p>
                      </div>
                    ))}
                    
                    {/* Founder's Signature */}
                    <div className="mt-10 pt-6 border-t border-gray-200">
                      <div className="pr-4 text-right">
                        <div className="text-lg font-semibold text-gray-700 mb-1">
                          {t.founder.name}
                        </div>
                        <div className="text-emerald-700">
                          <span>Founder, Dina Public School</span>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <div className="w-24 h-0.5 bg-emerald-500"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Testimonial */}
          <motion.div 
            className="mt-16 max-w-4xl mx-auto bg-green-50 p-8 rounded-2xl relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="absolute -top-6 left-8 bg-white p-2 rounded-full shadow-md">
              <FiMessageSquare className="text-3xl text-green-600" />
            </div>
            <p className="text-lg text-gray-700 italic mb-6">
              {t.founderQuote}
            </p>
            <div className="flex items-center">
              <div className="ml-4">
                <p className="font-semibold text-gray-900">{t.founder.name}</p>
                <p className="text-green-600 whitespace-pre-line">{t.founder.signature}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Academic Programs */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t.academic.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.academic.subtitle}
            </p>
          </div>
          
          {/* Curriculum Overview */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
              {t.programs}
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {currentPrograms.map((program, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="h-full bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col"
                >
                  <div className="p-6 pb-3 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-5">
                      {program.icon}
                    </div>
                    <h3 className={`text-xl font-bold text-gray-900 mb-3 ${language === 'bn' ? 'font-sans' : ''}`}>
                      {program.level}
                    </h3>
                    <p className="text-gray-600 mb-5 leading-relaxed">{program.description}</p>
                  </div>
                  <div className="px-6 pt-4 pb-6 bg-gray-50 border-t border-gray-100 mt-auto">
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                      {language === 'bn' ? 'প্রধান বৈশিষ্ট্য' : 'Key Features'}
                    </h4>
                    <ul className="space-y-2.5">
                      {program.features.map((item, i) => (
                        <li key={i} className="flex items-start text-gray-700">
                          <span className="text-emerald-500 mt-1 mr-2 flex-shrink-0">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                          <span className="text-sm leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Learning Approach */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.learningApproach.title}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.learningApproach.subtitle}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {t.learningApproach.items.map((item, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="text-green-600 mb-4">
                  {item.icon === 'FiUsers' && <FiUsers className="w-8 h-8" />}
                  {item.icon === 'FiActivity' && <FiActivity className="w-8 h-8" />}
                  {item.icon === 'FiMusic' && <FiMusic className="w-8 h-8" />}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment & Evaluation */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.assessment.title}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.assessment.subtitle}
            </p>
          </div>
          
          <div className="space-y-12">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {t.assessment.sections.map((section, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-50 p-8 rounded-xl border border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">{section.title}</h3>
                  <ul className="space-y-3">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-green-500 mt-1 mr-3">✓</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-2xl overflow-hidden shadow-xl w-full h-[500px] group mx-auto max-w-7xl"
            >
              <img 
                src="https://res.cloudinary.com/dhhzoshz7/image/upload/v1762442837/hostel-dpspaharpur_ekpoxs.jpg" 
                alt="School Hostel Facilities"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-8">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">{t.hostel.imageTitle}</h3>
                  <p className="text-green-100">{t.hostel.imageSubtitle}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Campuses */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.campuses.title}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.campuses.subtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {campuses.map((campus, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={campus.imageUrl} 
                    alt={`${campus.name} Campus`}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mr-4">
                      <FiHome className="text-green-600 text-xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{campus.name}</h3>
                  </div>
                  <div className="space-y-3 text-gray-600">
                    <p className="flex items-start">
                      <FiMapPin className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                      <span>{campus.address}</span>
                    </p>
                    <p className="flex items-center">
                      <FiPhone className="text-green-600 mr-2" />
                      <a href={`tel:${campus.phone}`} className="hover:text-green-700">{campus.phone}</a>
                    </p>
                    <p className="flex items-center">
                      <FiMail className="text-green-600 mr-2" />
                      <a href={`mailto:${campus.email}`} className="hover:text-green-700">{campus.email}</a>
                    </p>
                    <p className="flex items-center">
                      <FiClock className="text-green-600 mr-2" />
                      <span>{campus.hours}</span>
                    </p>
                  </div>
                  <div className="mt-6">
                    <Link 
                      to={campus.path}
                      className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-800 group"
                    >
                      View Campus Details 
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link 
              to="/campuses" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-sm hover:shadow-md transition-all duration-300"
            >
              View All Campuses
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default React.memo(AboutUs);
