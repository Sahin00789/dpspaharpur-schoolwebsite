import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiMenu, 
  FiX, 
  FiUser, 
  FiLogOut, 
  FiChevronDown, 
  FiHome, 
  FiBell, 
  FiAward, 
  FiImage, 
  FiInfo, 
  FiMail
} from "react-icons/fi";
import { FaGraduationCap } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { LanguageToggle } from "@/contexts/LanguageContext";
import { toast } from "react-hot-toast";

// Animation variants
const menuItem = {
  hidden: { opacity: 0, y: -10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3
    }
  })
};

const mobileMenu = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

const mobileLinkVariant = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3
    }
  },
  exit: { x: -20, opacity: 0 }
};

const MenuLink = ({ to, label, icon: Icon, index = 0 }) => {
  return (
    <motion.li 
      variants={menuItem}
      custom={index}
      className="relative"
    >
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
            isActive 
              ? 'text-white bg-green-600 shadow-md' 
              : 'text-gray-700 hover:bg-gray-100 hover:text-green-700'
          }`
        }
      >
        {Icon && <Icon className="w-5 h-5 mr-2" />}
        {label}
      </NavLink>
    </motion.li>
  );
};

const MobileLink = ({ to, children, onClick, index = 0, icon: Icon }) => {
  return (
    <motion.li 
      variants={mobileLinkVariant}
      className="border-b border-gray-100 last:border-0"
    >
      <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
          `flex items-center px-6 py-4 text-base font-medium transition-colors ${
            isActive
              ? 'bg-green-50 text-green-700 font-medium'
              : 'text-gray-700 hover:bg-gray-50'
          }`
        }
      >
        {Icon && <Icon className="w-5 h-5 mr-3 text-green-600" />}
        {children}
      </NavLink>
    </motion.li>
  );
};

export default function Navbar() {
  const headerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut, isAuthenticated } = useAuth();
  
  const navLinks = [
    { to: "/", label: "Home", icon: FiHome },
    { to: "/notices", label: "Notices", icon: FiBell },
    { 
      to: "https://marks-mint-dps-paharpur-web.vercel.app/", 
      label: "Results", 
      icon: FiAward,
      external: true 
    },
    { to: "/gallery", label: "Gallery", icon: FiImage },
    { to: "/about", label: "About", icon: FiInfo },
    { to: "/contact", label: "Contact", icon: FiMail },
    { to: "/admission", label: "Admissions", icon: FaGraduationCap },
  ];

  const handleLogout = async () => {
    setProfileMenuOpen(false);
    try {
      await signOut();
      toast.success('Successfully logged out');
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Failed to sign out');
    }
  };

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const ProfileMenu = () => (
    <motion.div 
      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-50"
      initial="hidden"
      animate={profileMenuOpen ? "visible" : "hidden"}
      exit="exit"
      variants={{
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.15 } }
      }}
    >
      <Link
        to="/profile"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        onClick={() => setProfileMenuOpen(false)}
      >
        <FiUser className="inline-block w-4 h-4 mr-2" />
        Your Profile
      </Link>
      <button
        onClick={handleLogout}
        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
      >
        <FiLogOut className="inline-block w-4 h-4 mr-2" />
        Sign out
      </button>
    </motion.div>
  );

  return (
    <header 
      ref={headerRef}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm"
    >
      <div className="w-full max-w-[95%] xl:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-green-700">
                  Dina Public School
                </h1>
                <span className="mt-1 px-2.5 py-0.5 text-xs font-medium bg-amber-50 text-amber-700 rounded-full border border-amber-100 w-fit">
                  Paharpur Branch
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <ul className="flex items-center space-x-1">
              {navLinks.map((link, index) => link.external ? (
                <a
                  key={link.to}
                  href={link.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <MenuLink 
                  key={link.to} 
                  to={link.to} 
                  label={link.label}
                  icon={link.icon}
                  index={index}
                />
              ))}
            </ul>

            <div className="ml-6 flex items-center space-x-4">
              <div className="hidden md:block">
                <LanguageToggle />
              </div>
              
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                    aria-label="Toggle profile menu"
                  >
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-medium">
                      {user?.displayName?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <FiChevronDown 
                      className={`h-4 w-4 transition-transform duration-200 ${
                        profileMenuOpen ? 'transform rotate-180' : ''
                      }`} 
                    />
                  </button>
                  <AnimatePresence>
                    {profileMenuOpen && (
                      <div 
                        className="absolute right-0 w-56 mt-2 origin-top-right z-50"
                      >
                        <ProfileMenu />
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/admin/login"
                    className="px-4 py-2 text-sm font-medium text-green-700 hover:text-green-800"
                  >
                    Admin Login
                  </Link>
                  <Link
                    to="/admission"
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Apply Now
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile menu button - shown on medium and small screens */}
          <div className="flex lg:hidden items-center ml-2 sm:ml-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-green-600 focus:outline-none p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? 
                <FiX size={22} className="w-5 h-5 sm:w-6 sm:h-6" /> : 
                <FiMenu size={22} className="w-5 h-5 sm:w-6 sm:h-6" />
              }
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { 
                duration: 0.2,
                ease: 'easeOut',
                when: "beforeChildren",
                staggerChildren: 0.03
              }
            }}
            exit={{ 
              opacity: 0, 
              y: -10,
              transition: { 
                duration: 0.15,
                ease: 'easeIn',
                when: "afterChildren"
              } 
            }}
            className="lg:hidden fixed inset-x-0 top-16 bg-white/95 backdrop-blur-lg shadow-lg overflow-y-auto z-50"
            style={{
              maxHeight: 'calc(100vh - 4rem)',
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain'
            }}
          >
            <div className="px-4 py-4 space-y-1">
              {/* Enhanced Language Toggle for Mobile */}
              <motion.div 
                className="flex justify-center mb-4 pb-4 border-b border-gray-100"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="bg-gray-50 rounded-lg p-1.5 shadow-inner">
                  <LanguageToggle />
                </div>
              </motion.div>
              
              {/* Mobile Navigation Links */}
              {navLinks.map((link, index) => (
                <MobileLink
                  key={link.to}
                  to={link.to}
                  onClick={() => {
                    setIsOpen(false);
                    if (link.external) {
                      window.open(link.to, '_blank');
                    }
                  }}
                  icon={link.icon}
                  index={index}
                >
                  {link.label}
                </MobileLink>
              ))}

              {isAuthenticated && user ? (
                <motion.button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center px-6 py-4 text-base text-red-600 hover:bg-red-50/80 transition-colors"
                  variants={mobileLinkVariant}
                  custom={navLinks.length + 2}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiLogOut className="mr-3 h-5 w-5 text-red-400 flex-shrink-0" />
                  <span>Sign out</span>
                </motion.button>
              ) : (
                <motion.div
                  variants={mobileLinkVariant}
                  custom={navLinks.length + 2}
                  className="px-6 py-2"
                >
                  <Link
                    to="/admin/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm transition-all"
                  >
                    <FiUser className="mr-2 h-4 w-4" />
                    Admin Login
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}