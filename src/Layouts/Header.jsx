import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiUser, FiLogOut, FiChevronDown } from "react-icons/fi";
import { FaSchool } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";

// Animation variants
const menuItem = {
  closed: { opacity: 0, y: -10 },
  open: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  }
};

const mobileLinkVariant = {
  initial: { x: -20, opacity: 0 },
  animate: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.2 }
  }
};

const dropdownVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring",
      damping: 25,
      stiffness: 300
    }
  },
  exit: { opacity: 0, y: -10, scale: 0.98 }
};

const MenuLink = ({ to, label }) => (
  <motion.div variants={menuItem}>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative px-4 py-2.5 mx-1 rounded-lg font-medium transition-all duration-200 group ${
          isActive 
            ? 'text-blue-600 font-semibold' 
            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
        }`
      }
    >
      <span className="relative z-10">{label}</span>
      <motion.span
        className="absolute inset-0 bg-blue-50 rounded-lg -z-0 scale-0 group-hover:scale-100 transition-transform duration-200"
        layoutId="hoverBg"
        initial={false}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30
        }}
      />
      {({ isActive }) => isActive && (
        <motion.span
          layoutId="activeNav"
          className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-blue-600 rounded-full w-6"
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
        />
      )}
    </NavLink>
  </motion.div>
);

const MobileLink = ({ to, children, onClick }) => (
  <motion.div
    variants={mobileLinkVariant}
    className="border-b border-gray-100 last:border-0"
  >
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `block px-6 py-3.5 text-base font-medium transition-colors ${
          isActive
            ? 'text-blue-600 bg-blue-50/50 font-semibold border-r-4 border-blue-600'
            : 'text-gray-700 hover:bg-gray-50/50'
        }`
      }
    >
      {children}
    </NavLink>
  </motion.div>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logOut } = useAuth();
  const isAuthenticated = !!user;
  
  const navLinks = [
    { to: "/academics", label: "Academics" },
    { to: "/notices", label: "Notices" },
    { to: "/gallery", label: "Gallery" },
    { to: "/about", label: "About" },
    { to: "/campuses", label: "Campuses" },
    { to: "/contact", label: "Contact" },
    { to: "/admission", label: "Admissions" },
  ];

  const handleLogout = async () => {
    setProfileMenuOpen(false);
    try {
      const result = await logOut();
      if (result?.success) {
        toast.success('Successfully logged out');
        navigate('/', { replace: true });
      } else {
        throw new Error(result?.error || 'Failed to sign out');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Failed to sign out');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const renderProfileMenu = () => (
    <motion.div 
      className="py-1 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={dropdownVariants}
    >
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-900 truncate">
          {user?.displayName || 'Welcome'}
        </p>
        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        {isAdmin && (
          <span className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Admin
          </span>
        )}
      </div>
      
      <div className="py-1">
        {isAdmin && (
          <>
            <Link
              to="/admin"
              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 group"
              onClick={() => setProfileMenuOpen(false)}
            >
              <svg className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Admin Dashboard
            </Link>
            <div className="border-t border-gray-100 my-1" />
          </>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}
          className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 group"
        >
          <FiLogOut className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-600" />
          <span>Sign out</span>
        </button>
      </div>
    </motion.div>
  );

  const headerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [headerRef]);

  return (
    <header 
      ref={headerRef}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm py-2' : 'bg-white/90 py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="group flex-shrink-0">
            <div className="flex items-center space-x-3">
             
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Dina Public School
                </h1>
                <div className="flex justify-end mt-0.5">
                  <span className="text-xs bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 px-2.5 py-1 rounded-full font-medium border border-blue-100">
                    Paharpur Branch
                  </span>
                </div>
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-2">
            <motion.div 
              className="flex items-center space-x-1"
              initial="closed"
              animate="open"
              variants={{
                open: {
                  transition: {
                    staggerChildren: 0.08,
                    delayChildren: 0.1
                  }
                }
              }}
            >
              {navLinks.map((link) => (
                <MenuLink 
                  key={link.to} 
                  to={link.to} 
                  label={link.label}
                />
              ))}
            </motion.div>
            
            {isAuthenticated ? (
              <div className="relative ml-4">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-blue-600 focus:outline-none"
                >
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <FiUser className="h-5 w-5" />
                  </div>
                  <FiChevronDown 
                    className={`h-4 w-4 transition-transform duration-200 ${
                      profileMenuOpen ? 'transform rotate-180' : ''
                    }`} 
                  />
                </button>

                <AnimatePresence>
                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      {renderProfileMenu()}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link 
                to="/admin/login"
                className="ml-4 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Admin Login
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center ml-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none p-2 rounded-full hover:bg-gray-100"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-white shadow-xl rounded-b-xl overflow-hidden"
          >
            <div className="px-4 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <MobileLink key={link.to} to={link.to} onClick={() => setIsOpen(false)}>
                  {link.label}
                </MobileLink>
              ))}
              {isAuthenticated && isAdmin && (
                <MobileLink to="/admin" onClick={() => setIsOpen(false)}>
                  Dashboard
                </MobileLink>
              )}
              {isAuthenticated && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center px-4 py-3 text-base text-red-600 hover:bg-red-50"
                >
                  <FiLogOut className="mr-3 h-5 w-5 text-red-400" />
                  <span>Sign out</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}