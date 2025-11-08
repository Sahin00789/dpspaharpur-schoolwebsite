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
    <div className={`flex items-center space-x-3 bg-gray-100 rounded-lg p-1 ${className}`}>
      <button
        onClick={() => language !== 'en' && toggleLanguage()}
        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
          language === 'en' 
            ? 'bg-white shadow-sm text-blue-600 font-medium' 
            : 'text-gray-600 hover:bg-gray-200'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      
      <button
        onClick={() => language !== 'bn' && toggleLanguage()}
        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
          language === 'bn' 
            ? 'bg-white shadow-sm text-green-600 font-medium' 
            : 'text-gray-600 hover:bg-gray-200'
        }`}
        aria-label="Switch to Bengali"
      >
        বাংলা
      </button>
    </div>
  );
}

export default LanguageContext;
