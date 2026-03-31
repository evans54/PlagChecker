import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Notifications from './Notifications';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              PlagCheck
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="hover:text-blue-200 transition-colors">
              Home
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="hover:text-blue-200 transition-colors">
                  Dashboard
                </Link>
                <Link to="/upload" className="hover:text-blue-200 transition-colors">
                  Upload
                </Link>
                <Link to="/bundles" className="hover:text-blue-200 transition-colors">
                  Bundles
                </Link>
                <Link to="/reports" className="hover:text-blue-200 transition-colors">
                  Reports
                </Link>
              </>
            )}
          </div>
          
          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                <Notifications />
                <span className="text-sm">
                  Slots: <span className="font-bold">{user.slots}</span>
                </span>
                <div className="relative group">
                  <button className="flex items-center text-sm hover:text-blue-200 transition-colors">
                    <div className="text-left">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-blue-200 text-xs">{user.email}</div>
                    </div>
                    <span className="ml-2">▼</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-white hover:text-blue-200 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden py-4 space-y-2">
            <Link to="/" className="block py-2 hover:text-blue-200 transition-colors">
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block py-2 hover:text-blue-200 transition-colors">
                  Dashboard
                </Link>
                <Link to="/upload" className="block py-2 hover:text-blue-200 transition-colors">
                  Upload
                </Link>
                <Link to="/bundles" className="block py-2 hover:text-blue-200 transition-colors">
                  Bundles
                </Link>
                <Link to="/reports" className="block py-2 hover:text-blue-200 transition-colors">
                  Reports
                </Link>
                <div className="pt-2 border-t border-blue-500">
                  <div className="text-sm py-2">
                    Slots: <span className="font-bold">{user?.slots || 0}</span>
                  </div>
                  <div className="text-sm py-2">
                    {user?.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2 hover:text-blue-200 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 hover:text-blue-200 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="block py-2 hover:text-blue-200 transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
