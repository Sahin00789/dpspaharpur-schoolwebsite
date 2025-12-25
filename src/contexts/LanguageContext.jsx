import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const LanguageContext = createContext();

// Custom hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Language Provider Component
export function LanguageProvider({ children }) {
  // Default to English if no language is set in localStorage
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });
  
  // Handle language change effects
  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('language', language);
    
    // Set HTML lang attribute
    document.documentElement.lang = language;
    
    // Handle RTL for Bengali
    if (language === 'bn') {
      document.documentElement.setAttribute('dir', 'ltr'); // Keep LTR for the document
      document.body.classList.add('bengali-font');
    } else {
      document.documentElement.removeAttribute('dir');
      document.body.classList.remove('bengali-font');
    }
    
    // Cleanup on unmount
    return () => {
      document.documentElement.removeAttribute('dir');
      document.body.classList.remove('bengali-font');
    };
  }, [language]);

  // Toggle between English and Bengali
  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'en' ? 'bn' : 'en');
  };

  // Value to be provided by the context
  const value = {
    language,
    toggleLanguage,
    isEnglish: language === 'en',
    isBengali: language === 'bn'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

import { motion, AnimatePresence } from 'framer-motion';

const spring = {
  type: 'spring',
  stiffness: 700,
  damping: 30,
};

export function LanguageToggle({ className = '' }) {
  const { language, toggleLanguage } = useLanguage();
  
  if (!language) return null;

  return (
    <button
      onClick={toggleLanguage}
      className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full overflow-hidden transition-all duration-300 ${
        language === 'en' 
          ? 'bg-emerald-600 text-white shadow-emerald-200' 
          : 'bg-green-600 text-white shadow-green-200'
      } shadow-lg hover:scale-105 active:scale-95 ${className}`}
      aria-label="Toggle Language"
    >
      <div className="flex items-center gap-1.5 font-bold tracking-wider">
        <span className={`transition-all duration-300 ${language === 'en' ? 'scale-110 opacity-100' : 'scale-90 opacity-60'}`}>
          A
        </span>
        <span className="w-[1px] h-3 bg-white/30" />
        <span className={`text-lg transition-all duration-300 ${language === 'bn' ? 'scale-110 opacity-100' : 'scale-90 opacity-60'}`}>
          অ
        </span>
      </div>
      
      {/* Animated Indicator */}
      <motion.div
        className="absolute inset-0 bg-white/20"
        initial={false}
        animate={{
          x: language === 'en' ? '-50%' : '50%',
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    </button>
  );
}

export default LanguageContext;
