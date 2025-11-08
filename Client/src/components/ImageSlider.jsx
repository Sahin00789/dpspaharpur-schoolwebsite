import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaPause, FaPlay } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';

const ImageSlider = ({ 
  images = [], 
  autoPlay = true, 
  interval = 5000,
  showControls = true,
  showPagination = true,
  height = '500px',
  className = ''
}) => {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const sliderRef = useRef(null);
  const timerRef = useRef(null);
  
  // Get localized content based on current language
  const getLocalizedContent = useCallback((slide) => {
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
  }, [language]);

  // Calculate localized content based on current slide and language
  const localizedContent = images.length > 0 && currentIndex < images.length 
    ? getLocalizedContent(images[currentIndex])
    : {};

  // Preload next and previous images
  useEffect(() => {
    const preloadImages = () => {
      const nextIndex = (currentIndex + 1) % images.length;
      const prevIndex = (currentIndex - 1 + images.length) % images.length;
      
      [nextIndex, prevIndex].forEach(index => {
        if (images[index]?.image) {
          const img = new Image();
          img.src = images[index].image;
        }
      });
    };
    
    if (images.length > 0) {
      preloadImages();
    }
  }, [currentIndex, images]);

  const nextSlide = useCallback(() => {
    setCurrentIndex(prevIndex => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    if (isPlaying) {
      resetTimer();
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, interval);
    }
  }, [isPlaying, interval, nextSlide]);

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [resetTimer]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          prevSlide();
          break;
        case 'ArrowRight':
          nextSlide();
          break;
        case ' ':
        case 'Spacebar':
          e.preventDefault();
          togglePlayPause();
          break;
        default:
          break;
      }
    };

    if (sliderRef.current) {
      sliderRef.current.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (sliderRef.current) {
        sliderRef.current.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [nextSlide, prevSlide]);

  // Touch event handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      nextSlide();
    }

    if (touchStart - touchEnd < -50) {
      prevSlide();
    }
  };

  if (!images || images.length === 0) {
    return (
      <div 
        className="relative w-full flex items-center justify-center bg-gray-100" 
        style={{ height }}
      >
        <p className="text-gray-500">No images to display</p>
      </div>
    );
  }

  return (
    <div 
      ref={sliderRef}
      className="relative w-full overflow-hidden group"
      style={{ height }}
      role="region"
      aria-label="Image carousel"
      tabIndex={0}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(autoPlay)}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="w-full h-full relative"
          aria-live="polite"
          aria-atomic="true"
          aria-label={`Slide ${currentIndex + 1} of ${images.length}`}
        >
          <img
            src={images[currentIndex].image}
            alt={getLocalizedContent(images[currentIndex]).alt}
            className="w-full h-full object-cover"
            loading={currentIndex === 0 ? 'eager' : 'lazy'}
            decoding="async"
            draggable="false"
          />
          
          {(localizedContent.title || localizedContent.description) && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col items-center justify-end pb-12 px-4 text-center">
              <div className="max-w-4xl w-full">
                {localizedContent.title && (
                  <motion.h2 
                    className={`text-3xl md:text-5xl font-bold text-white mb-4 ${language === 'bn' ? 'font-bengali' : ''}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    dir={language === 'bn' ? 'ltr' : 'auto'}
                  >
                    {localizedContent.title}
                  </motion.h2>
                )}
                
                {localizedContent.description && (
                  <motion.p 
                    className={`text-lg md:text-xl text-gray-100 mb-6 ${language === 'bn' ? 'font-bengali leading-relaxed' : ''}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    dir={language === 'bn' ? 'ltr' : 'auto'}
                  >
                    {localizedContent.description}
                  </motion.p>
                )}
                
                {localizedContent.buttonText && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <button 
                      className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${language === 'bn' ? 'font-bengali' : ''}`}
                      onClick={() => images[currentIndex]?.onButtonClick?.()}
                    >
                      {localizedContent.buttonText}
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {showControls && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Previous slide"
          >
            <FaChevronLeft size={20} />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Next slide"
          >
            <FaChevronRight size={20} />
          </button>
          
          <button
            onClick={togglePlayPause}
            className="absolute left-4 top-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all focus:outline-none focus:ring-2 focus:ring-white"
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
          </button>
        </>
      )}

      {showPagination && images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-8 bg-white' 
                  : 'w-3 bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex ? 'true' : 'false'}
            />
          ))}
        </div>
      )}

      {/* Status text for screen readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {`${language === 'bn' ? 'স্লাইড' : 'Slide'} ${currentIndex + 1} ${language === 'bn' ? 'এর' : 'of'} ${images.length}: ${localizedContent.title || ''}`}
      </div>
    </div>
  );
};

export default ImageSlider;
