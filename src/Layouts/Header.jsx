import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiChevronDown, FiUser, FiLogOut } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth.jsx";
import { toast } from "react-hot-toast";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user, signOut } = useAuth();
  
  const handleLogout = async () => {
    setProfileMenuOpen(false); // Close the profile menu
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
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => document.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { to: "/academics", label: "Academics" },
    { to: "/notices", label: "Notices" },
    { to: "/gallery", label: "Gallery" },
    { to: "/about", label: "About" },
    { to: "/campuses", label: "Campuses" },
    { to: "/contact", label: "Contact" },
    { to: "/admission", label: "Admissions" },
  ];

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 shadow-md py-2' : 'bg-white/90 py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <Link to="/" className="flex items-center">
              <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Dina Public School
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link, index) => (
              <MenuLink 
                key={link.to} 
                to={link.to} 
                label={link.label} 
                delay={index * 0.1}
              />
            ))}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                >
                  <Link
                    to="/admin"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Dashboard
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (navLinks.length * 0.1) + 0.1 }}
                  className="relative"
                >
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                    ) : (
                      <FiUser className="text-blue-600" />
                    )}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-gray-700 font-medium">{user?.displayName || 'Account'}</span>
                    {isAdmin && <span className="text-xs text-gray-500">Admin</span>}
                  </div>
                </button>
                
                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 divide-y divide-gray-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="px-4 py-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{user?.displayName || 'User'}</p>
                          {isAdmin && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Admin</span>}
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-1">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        {isAdmin && (
                          <>
                            <Link
                              to="/admin"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setProfileMenuOpen(false)}
                            >
                              <svg className="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                              </svg>
                              Dashboard
                            </Link>
                            <div className="border-t border-gray-100 my-1"></div>
                          </>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <FiLogOut className="mr-3 h-5 w-5 text-gray-400" />
                          <span>Sign out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                </motion.div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
              >
                <NavLink
                  to="/login"
                  className="ml-4 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Admin Login
                </NavLink>
              </motion.div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-4 md:hidden">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                    ) : (
                      <FiUser className="text-blue-600" />
                    )}
                  </div>
                </button>
                
                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 divide-y divide-gray-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="px-4 py-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{user?.displayName || 'User'}</p>
                          {isAdmin && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Admin</span>}
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-1">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        {isAdmin && (
                          <>
                            <Link
                              to="/admin"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setProfileMenuOpen(false)}
                            >
                              <svg className="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                              </svg>
                              Dashboard
                            </Link>
                            <div className="border-t border-gray-100 my-1"></div>
                          </>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <FiLogOut className="mr-3 h-5 w-5 text-gray-400" />
                          <span>Sign out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
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
                <MobileLink key={link.to} to={link.to}>
                  {link.label}
                </MobileLink>
              ))}
              {isAuthenticated && (
                <MobileLink to="/admin" onClick={() => setIsOpen(false)}>
                  Dashboard
                </MobileLink>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

const MenuLink = ({ to, label, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <NavLink
        to={to}
        className={({ isActive }) =>
          `relative px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            isActive 
              ? 'text-blue-600 font-semibold' 
              : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
          }`
        }
      >
        {({ isActive }) => (
          <>
            {label}
            {isActive && (
              <motion.span
                layoutId="activeNav"
                className="absolute bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              />
            )}
          </>
        )}
      </NavLink>
    </motion.div>
  );
};

const MobileLink = ({ to, children, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="border-b border-gray-100 last:border-0"
    >
      <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
          `block px-4 py-3 text-base font-medium transition-colors ${
            isActive
              ? 'text-blue-600 bg-blue-50 font-semibold'
              : 'text-gray-700 hover:bg-gray-50'
          }`
        }
      >
        {children}
      </NavLink>
    </motion.div>
  );
};
