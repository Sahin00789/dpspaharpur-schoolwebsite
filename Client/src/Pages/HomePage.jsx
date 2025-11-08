import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiAward, FiBookOpen, FiUsers, FiCalendar, FiBarChart2, FiTrendingUp, FiAward as FiAward2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';
import ImageSlider from '../components/ImageSlider';
import Footer from '../Layouts/Footer';
import { SLIDER_IMAGES } from '../data/sliderImages';

// Translations
const translations = {
  en: {
    features: [
      {
        title: 'Academic Distinction',
        description: 'Consistently achieving top academic results while fostering well-rounded development and critical thinking skills.',
      },
      {
        title: 'Holistic Learning',
        description: 'Innovative curriculum designed to cultivate intellectual curiosity, creativity, and essential life skills.',
      },
      {
        title: 'Expert Educators',
        description: 'Passionate and accomplished teachers dedicated to inspiring and guiding each student towards excellence.',
      },
      {
        title: 'Vibrant Campus Life',
        description: 'Diverse range of sports, arts, and cultural programs that enrich the educational experience.',
      },
    ],
    stats: [
      { value: '1000+', label: 'Students' },
      { value: '50+', label: 'Qualified Teachers' },
      { value: '95%', label: 'Success Rate' },
      { value: '10+', label: 'Years of Excellence' },
    ],
    hero: {
      title: 'Shaping Future Leaders with Excellence',
      subtitle: 'Where academic brilliance meets moral values and innovative thinking',
      cta: 'Begin Your Journey',
      secondaryCta: 'Explore Our Campus'
    },
    about: {
      title: 'A Legacy of Educational Excellence',
      description: 'Where tradition meets innovation in education, shaping well-rounded individuals prepared for global challenges.',
      button: 'View Results',
    },
    admission: {
      title: 'Limited Seats Available',
      description: 'Secure your child\'s future with quality education. Admissions open for 2024-25',
      button: 'Apply for Admission',
    }
  },
  bn: {
    features: [
      {
        title: 'শিক্ষায় সেরা',
        description: 'ভালো ফলাফলের পাশাপাশি শিক্ষার্থীদের সৃজনশীলতা ও যুক্তিবোধের বিকাশে আমরা সচেষ্ট।',
      },
      {
        title: 'সুষম শিক্ষা',
        description: 'আধুনিক পদ্ধতিতে পাঠদান, যা শিক্ষার্থীদের বাস্তব জীবনের জন্য প্রস্তুত করে তোলে।',
      },
      {
        title: 'দক্ষ শিক্ষক',
        description: 'অভিজ্ঞ শিক্ষকমন্ডলী যারা প্রতিটি শিক্ষার্থীকে বিশেষ যত্ন ও গুরুত্ব দিয়ে থাকেন।',
      },
      {
        title: 'বিভিন্ন কার্যক্রম',
        description: 'খেলাধুলা, সাংস্কৃতিক অনুষ্ঠান ও সৃজনশীল কার্যক্রমের মাধ্যমে শিক্ষাকে করা হয় আরও আকর্ষণীয়।',
      },
    ],
    stats: [
      { value: '১০০০+', label: 'শিক্ষার্থী' },
      { value: '৫০+', label: 'যোগ্য শিক্ষক' },
      { value: '৯৫%', label: 'সাফল্যের হার' },
      { value: '১০+', label: 'সাফল্যের বছর' },
    ],
    hero: {
      title: 'ভবিষ্যতের নেতৃত্ব গড়ার পথে অগ্রগামী',
      subtitle: 'শিক্ষার ক্ষেত্রে শ্রেষ্ঠত্ব, নৈতিক মূল্যবোধ এবং উদ্ভাবনী চিন্তার সমন্বয়ে গঠিত আমাদের শিক্ষা ব্যবস্থা',
      cta: 'আপনার যাত্রা শুরু করুন',
      secondaryCtx: 'আমাদের ক্যাম্পাস পরিদর্শন করুন'
    },
    about: {
      title: 'শিক্ষার ক্ষেত্রে এক অনন্য ধারা',
      description: 'যেখানে ঐতিহ্য ও আধুনিকতার মেলবন্ধনে গড়ে উঠছে আগামীর যোগ্য নাগরিক, প্রস্তুত বিশ্বমঞ্চে মাথা উঁচু করে দাঁড়ানোর জন্য।',
      button: 'ফলাফল দেখুন',
    },
    admission: {
      title: 'সীমিত আসন শূন্য',
      description: 'আপনার সন্তানের ভবিষ্যৎ গড়ে তুলুন মানসম্মত শিক্ষায়। ২০২৪-২৫ শিক্ষাবর্ষের জন্য ভর্তি চলছে',
      button: 'ভর্তির জন্য আবেদন করুন',
    }
  }
};

const featureIcons = [
  <FiAward className="w-8 h-8 text-green-600" key="award" />,
  <FiBookOpen className="w-8 h-8 text-green-600" key="book" />,
  <FiUsers className="w-8 h-8 text-green-600" key="users" />,
  <FiCalendar className="w-8 h-8 text-green-600" key="calendar" />
];

const HomePage = () => {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  
  // Combine features with their icons
  const features = t.features.map((feature, index) => ({
    ...feature,
    icon: featureIcons[index % featureIcons.length]
  }));
  
  const stats = t.stats;
  const handleAdmissionClick = () => {
    toast.success('Redirecting to admission page...');
  };

  const sliderImages = SLIDER_IMAGES;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative pt-10 bg-gradient-to-r from-green-600 to-emerald-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(to_bottom,transparent_1%,white,transparent_99%)]" />
        <div className="container mx-auto px-6 py-20 md:py-32 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="text-center">
              <motion.div className="space-y-2">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight md:leading-normal"
                  dir={language === 'bn' ? 'rtl' : 'ltr'}
                >
                  {language === 'bn' ? (
                    <>
                      <span className="block md:inline">ভবিষ্যতের নেতৃত্ব</span>
                      <span className="block my-2 md:inline">গড়ার পথে অগ্রগামী</span>
                    </>
                  ) : (
                    t.hero.title
                  )}
                </motion.h1>
              </motion.div>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-8 text-xl max-w-3xl mx-auto text-green-100"
                dir={language === 'bn' ? 'rtl' : 'ltr'}
              >
                {t.hero.subtitle}
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
              <Link 
                to="/admission" 
                className="px-8 py-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                onClick={handleAdmissionClick}
              >
                {t.admission.button} <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/about" 
                className="px-8 py-4 text-lg font-semibold rounded-lg bg-white/10 hover:bg-white/20 border-2 border-white/30 text-white hover:border-white/50 backdrop-blur-sm transition-all duration-300 flex items-center justify-center group"
              >
                {t.hero.secondaryCta || t.about.button}
                <svg className={`w-5 h-5 ${language === 'bn' ? 'mr-2 -ml-1' : 'ml-2 -mr-1'} group-hover:translate-x-1 transition-transform`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              </motion.div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Image Slider Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <ImageSlider images={sliderImages} autoPlay={true} interval={5000} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.features[0].title}</h2>
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
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6 mx-auto">
                  {feature.icon}
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  {feature.title}
                </h2>
                <p className="mt-4 text-lg text-gray-600" dir={language === 'bn' ? 'rtl' : 'ltr'}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              className="relative bg-white p-8 md:p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-green-100 rounded-full -ml-20 -mb-20 opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="text-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{t.about.title}</h2>
                  <p className="text-gray-600 mb-8 max-w-2xl mx-auto" dir={language === 'bn' ? 'rtl' : 'ltr'}>
                    {t.about.description}
                  </p>
                
                  <div className="pt-6 border-t border-gray-100">
                    <a 
                      href="https://marks-mint-dps-paharpur-web.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 border-2 border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 md:py-4 md:text-lg md:px-8"
                    >
                      {t.about.button}
                      <FiArrowRight className={`${language === 'bn' ? 'mr-2 -ml-1' : 'ml-2 -mr-1'} w-5 h-5`} />
                    </a>
                  </div>
                </div>
              </div>
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
