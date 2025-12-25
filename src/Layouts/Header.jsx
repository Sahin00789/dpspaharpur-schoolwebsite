import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';  
import { Link } from 'react-router-dom';
import LanguageToggle from './LanguageToggle';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { language } = useLanguage();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed w-full z-50 px-2 sm:px-4 pt-4 pointer-events-none">
      <div className={`container mx-auto max-w-5xl pointer-events-auto transition-all duration-500 transform ${
        scrolled ? 'translate-y-0' : 'translate-y-2'
      }`}>
        <nav className={`flex items-center justify-between px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border transition-all duration-500 ${
          scrolled 
            ? 'bg-white/80 backdrop-blur-xl shadow-2xl border-emerald-100/50' 
            : 'bg-white/40 backdrop-blur-md border-white/20 shadow-lg'
        }`}>
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <h1 className={`font-bold transition-all duration-300 ${
              scrolled ? 'text-sm sm:text-base md:text-lg lg:text-xl' : 'text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl'
            } text-gray-900 group-hover:text-emerald-700 leading-tight`}>
              {language === 'bn' ? 'দিনা পাবলিক স্কুল' : 'Dina Public School'}
            </h1>
            <div className="flex items-center">
              <span className={`px-2 py-0.5 sm:px-3 rounded-full text-[8px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                scrolled 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'bg-white/80 text-emerald-800 border border-emerald-100'
              }`}>
                Paharpur
              </span>
            </div>
          </Link>

          <div className="flex items-center">
            <LanguageToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}