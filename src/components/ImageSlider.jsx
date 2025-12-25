import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLanguage } from '../contexts/LanguageContext';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const ImageSlider = ({ 
  images = [], 
  autoPlay = true, 
  interval = 5000,
  showControls = true,
  showPagination = true,
  height = '500px',
  className = '',
  effect = 'slide',
  loop = true
}) => {
  const { language } = useLanguage();
  const swiperRef = useRef(null);
  
  // Get localized content based on current language
  const getLocalizedContent = (slide) => {
    if (!slide) return {};
    
    // If content is already an object with language keys
    if (typeof slide.title === 'object') {
      return {
        title: slide.title[language] || slide.title.en || '',
        description: slide.description?.[language] || slide.description?.en || '',
        buttonText: slide.buttonText?.[language] || slide.buttonText?.en || null,
        alt: slide.alt?.[language] || slide.alt?.en || slide.title?.[language] || slide.title?.en || 'Slider Image',
        onButtonClick: slide.onButtonClick
      };
    }
    
    // Fallback to direct properties if no language-specific content
    return {
      title: slide.title || '',
      description: slide.description || '',
      buttonText: slide.buttonText || null,
      alt: slide.alt || slide.title || 'Slider Image',
      onButtonClick: slide.onButtonClick
    };
  };

  // Initialize Swiper instance
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const swiperInstance = swiperRef.current.swiper;
      
      if (autoPlay) {
        swiperInstance.autoplay?.start();
      } else {
        swiperInstance.autoplay?.stop();
      }
      
      return () => {
        swiperInstance.autoplay?.stop();
      };
    }
  }, [autoPlay]);

  if (!images || images.length === 0) {
    return (
      <div 
        className="relative w-full flex items-center justify-center bg-emerald-50" 
        style={{ height, minHeight: '300px' }}
      >
        <p className="text-emerald-700">No images to display</p>
      </div>
    );
  }

  // Get current slide data safely
  const currentSlide = images[0];
  if (!currentSlide) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-emerald-50">
        <p className="text-emerald-700">No images to display</p>
      </div>
    );
  }

  // Calculate image URL with mobile-optimized parameters
  const getOptimizedImageUrl = (url) => {
    if (!url) return '';
    // Add Cloudinary transformations for mobile optimization
    if (url.includes('res.cloudinary.com')) {
      // Add width and quality parameters for mobile
      if (url.includes('upload/')) {
        return url.replace('upload/', 'upload/w_800,q_auto,f_auto/');
      }
    }
    return url;
  };

  return (
    <div 
      className={`relative w-full overflow-hidden ${className}`}
      style={{ height, minHeight: '300px' }}
      role="region"
      aria-label="Image carousel"
    >
      <Swiper
        ref={swiperRef}
        modules={[Autoplay, EffectFade]}
        navigation={false}
        pagination={false}
        effect={effect}
        loop={loop}
        autoplay={autoPlay ? { delay: interval, disableOnInteraction: false } : false}
        className="h-full"
      >
        {images.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="absolute inset-0 w-full h-full">
              <div 
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${getOptimizedImageUrl(slide.image)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  width: '100%',
                  height: '100%',
                  display: 'block',
                  pointerEvents: 'none',
                  WebkitUserSelect: 'none',
                  userSelect: 'none',
                  WebkitTouchCallout: 'none'
                }}
                aria-hidden="true"
              />
              {/* Fallback img tag for better SEO and accessibility */}
              <img 
                src={getOptimizedImageUrl(slide.image)} 
                alt={getLocalizedContent(slide).alt} 
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              {(getLocalizedContent(slide).title || getLocalizedContent(slide).description) && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <motion.div 
                    className="max-w-6xl mx-auto px-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <div className="space-y-4">
                      {getLocalizedContent(slide).title && (
                        <motion.h2 
                          className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold text-white drop-shadow-lg"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                        >
                          {getLocalizedContent(slide).title}
                        </motion.h2>
                      )}
                      {getLocalizedContent(slide).description && (
                        <motion.p 
                          className="text-sm sm:text-base md:text-lg text-gray-200 max-w-2xl lg:max-w-3xl"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                        >
                          {getLocalizedContent(slide).description}
                        </motion.p>
                      )}
                      {getLocalizedContent(slide).buttonText && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.6 }}
                        >
                          <button
                            onClick={getLocalizedContent(slide).onButtonClick}
                            className="mt-4 px-6 py-2 bg-white text-emerald-700 font-medium rounded-lg hover:bg-emerald-50 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                          >
                            {getLocalizedContent(slide).buttonText}
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Add custom styles for Swiper components */}
      <style jsx="true" global="true">{`
        .swiper-button-disabled {
          opacity: 0.3;
          cursor: not-allowed;
          pointer-events: none;
        }
        .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          background: #10b981;
          width: 30px;
          border-radius: 4px;
        }
        .swiper-button-next:after, 
        .swiper-button-prev:after {
          display: none;
        }
      `}</style>
    </div>
  );
};

ImageSlider.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string.isRequired,
      title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          en: PropTypes.string,
          bn: PropTypes.string
        })
      ]),
      description: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          en: PropTypes.string,
          bn: PropTypes.string
        })
      ]),
      buttonText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          en: PropTypes.string,
          bn: PropTypes.string
        })
      ]),
      alt: PropTypes.string,
      onButtonClick: PropTypes.func
    })
  ),
  autoPlay: PropTypes.bool,
  interval: PropTypes.number,
  showControls: PropTypes.bool,
  showPagination: PropTypes.bool,
  height: PropTypes.string,
  className: PropTypes.string,
  effect: PropTypes.oneOf(['slide', 'fade', 'cube', 'coverflow', 'flip']),
  loop: PropTypes.bool
};

export default ImageSlider;
