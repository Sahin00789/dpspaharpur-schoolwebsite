import { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  FiHome, 
  FiMessageSquare, 
  FiSettings, 
  FiUserCheck,
  FiMenu,
  FiX,
  FiChevronDown,
  FiLogOut,
  FiFileText,
  FiGrid
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import schoolInfo from '../../hooks/useSchoolInfo';
import { toast } from 'react-hot-toast';

// Navigation item component
const NavItem = ({ to, icon: Icon, label, isCollapsed, onClick, onIconClick }) => {
  const { pathname } = useLocation();
  const isActive = pathname === to || (pathname.startsWith(to) && to !== '/admin');
  
  const handleClick = (e) => {
    if (onClick) onClick(e);
    // Prevent event propagation to parent elements
    e.stopPropagation();
  };

  const handleIconClick = (e) => {
    if (onIconClick) onIconClick(e);
    // Prevent navigation when clicking the icon
    e.preventDefault();
    e.stopPropagation();
  };
  
  return (
    <NavLink
      to={to}
      onClick={handleClick}
      className={`
        flex items-center gap-3 p-3 rounded-lg transition-colors
        ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}
        ${isCollapsed ? 'justify-center' : ''}
      `}
      title={isCollapsed ? label : ''}
    >
      <div 
        className="flex-shrink-0"
        onClick={handleIconClick}
      >
        <Icon size={20} />
      </div>
      {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
    </NavLink>
  );
};

// Navigation items
const navItems = [
  { path: '/admin/dashboard', icon: FiGrid, label: 'Dashboard' },
  { path: '/admin/messages', icon: FiMessageSquare, label: 'Messages' },
  { path: '/admin/notices', icon: FiFileText, label: 'Notices' },
  { path: '/admin/admissions', icon: FiUserCheck, label: 'Admissions' }
];

const AdminLayout = () => {
  const { user, logOut } = useAuth();
  const schoolInfoData = schoolInfo;
  const location = useLocation();
  const navigate = useNavigate();
  
  // State for responsive sidebar
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Refs
  const dropdownRef = useRef(null);
  const isNavigating = useRef(false);
  const navigationTimeout = useRef(null);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Close mobile menu when location changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);
  
  // Toggle sidebar collapse
  const toggleSidebar = useCallback((e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    // Only toggle if we're not in mobile mode or if we're explicitly toggling the menu
    if (!isMobile || e?.type === 'click') {
      setIsCollapsed(prev => !prev);
    }
  }, [isCollapsed, isMobile]);
  
  // Handle sign out
  const handleSignOut = async () => {
    try {
      await logOut();
      navigate('/admin/login');
    } catch (error) {
      toast.error('Failed to sign out');
      console.error('Sign out error:', error);
    }
  };

  // Check admin access
  const checkAdminAccess = useCallback(() => {
    if (isNavigating.current) return;
    
    if (!user) {
      // Only navigate if we're not already on the login page
      if (!location.pathname.includes('/admin/login')) {
        isNavigating.current = true;
        navigate('/admin/login', { 
          state: { from: location },
          replace: true
        });
        // Reset navigation lock after a short delay
        navigationTimeout.current = setTimeout(() => {
          isNavigating.current = false;
        }, 100);
      }
    } else if (user && !user.isAdmin) {
      if (location.pathname !== '/') {
        isNavigating.current = true;
        toast.error('You do not have permission to access this page');
        navigate('/', { replace: true });
        // Reset navigation lock after a short delay
        navigationTimeout.current = setTimeout(() => {
          isNavigating.current = false;
        }, 100);
      }
    }
  }, [user, navigate, location]);

  // Run the check when the component mounts
  useEffect(() => {
    checkAdminAccess();
  }, [checkAdminAccess]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* ===== Sidebar ===== */}
      <div
        className={`
          fixed h-screen z-50 inset-y-0 left-0 bg-white shadow-lg
          transition-all duration-300 flex flex-col
          ${isMobile ? 'w-64' : isCollapsed ? 'w-20' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {!isCollapsed && (
            <span className="font-bold text-lg">
              {schoolInfoData?.name || 'Admin Panel'}
            </span>
          )}
          {isCollapsed && <div className="w-8"></div>}

          <div className="flex items-center gap-2">
            {/* Desktop collapse button */}
            <button
              className="hidden lg:flex items-center justify-center hover:bg-gray-100 p-1 rounded"
              onClick={toggleSidebar}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <FiMenu size={20} /> : <FiX size={20} />}
            </button>

            {/* Mobile close button */}
            <button 
              className="lg:hidden hover:bg-gray-100 p-1 rounded"
              onClick={() => setMobileOpen(false)}
              aria-label="Close sidebar"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Sidebar Links */}
        <div className="p-2 space-y-1 mt-4 flex-1">
          {navItems.map((item) => (
            <NavItem 
              key={item.path}
              to={item.path}
              icon={item.icon}
              label={item.label}
              isCollapsed={!isMobile && isCollapsed}
              onClick={() => {
                if (isMobile) {
                  setMobileOpen(false);
                }
              }}
              onIconClick={(e) => {
                e.stopPropagation();
                if (!isMobile && isCollapsed) {
                  toggleSidebar(e);
                }
              }}
            />
          ))}
        </div>
        
        {/* Sidebar Footer */}
        <div className="mt-auto p-2 border-t border-gray-100">
          <NavLink
            to="/"
            className={{
              isActive: (match) =>
                'flex items-center gap-3 p-3 rounded-lg transition-colors ' +
                (match
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100') +
                ` ${!isMobile && isCollapsed ? 'justify-center' : ''}`,
            }}
            title={!isMobile && isCollapsed ? 'Back to Home' : ''}
          >
            <FiHome size={20} className="flex-shrink-0" />
            {(!isMobile && !isCollapsed) && <span className="text-sm font-medium">Back to Home</span>}
          </NavLink>
        </div>
      </div>

      {/* ===== Main Content Area ===== */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 ml-0 lg:ml-20 xl:ml-64 transition-all duration-300"
           style={{
             marginLeft: isMobile ? 0 : (isCollapsed ? '5rem' : '16rem')
           }}>
        {/* Navbar */}
        <nav className="flex items-center justify-between bg-white shadow px-4 py-3">
          <div className="flex items-center">
            <button 
              className="mr-4 p-1 hover:bg-gray-100 rounded lg:hidden" 
              onClick={() => setMobileOpen(true)}
              aria-label="Open sidebar"
            >
              <FiMenu size={24} />
            </button>
          </div>
          
          {/* School Info - Centered */}
          <div className="hidden md:flex flex-col items-center justify-center flex-1">
            <h1 className="text-lg font-semibold text-gray-800">
              {schoolInfoData?.name || 'Admin Panel'}
            </h1>
            {schoolInfoData?.branch && (
              <span className="mt-1 px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                {schoolInfoData.branch}
              </span>
            )}
          </div>
          
          {/* User Dropdown */}
          <div className="flex items-center gap-4 relative" ref={dropdownRef}>
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-indigo-700 font-medium">
                  {user?.email?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              {!isMobile && (
                <FiChevronDown size={16} className="text-gray-500" />
              )}
            </div>
            
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-12 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  <p className="font-medium">
                    {user?.displayName || 'Admin User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || 'admin@example.com'}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FiLogOut size={16} className="mr-2" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
