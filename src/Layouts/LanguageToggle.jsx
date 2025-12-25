import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="inline-flex rounded-lg overflow-hidden border border-gray-300 shadow-sm">
      <button
        onClick={() => language !== 'en' && toggleLanguage()}
        className={`px-3 py-2 text-sm font-medium transition-all duration-200 ${
          language === 'en' 
            ? 'bg-emerald-600 text-white' 
            : 'bg-white text-gray-600 hover:bg-gray-50'
        }`}
      >
        A
      </button>
      <button
        onClick={() => language !== 'bn' && toggleLanguage()}
        className={`px-3 py-2 text-sm font-bold transition-all duration-200 border-l border-gray-300 ${
          language === 'bn' 
            ? 'bg-emerald-600 text-white' 
            : 'bg-white text-gray-600 hover:bg-gray-50'
        }`}
      >
        অ
      </button>
    </div>
  );
}
