import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuthStatus();
  }, [location.pathname]);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("currentUser");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setIsLoggedIn(true);
        setIsAdmin(user.role === "admin");
        setUserName(user.fullName || "User");
      } catch (err) {
        console.error("Error parsing user data:", err);
        handleLogout();
      }
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
      setUserName("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setIsLoggedIn(false);
    setIsAdmin(false);
    setMenuOpen(false);
    navigate("/login");
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && !e.target.closest('nav')) {
        setMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gray-800/80 backdrop-blur-sm text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            onClick={() => setMenuOpen(false)}
            className="flex items-center"
          >
            <img
              src="https://csiportal-eight.vercel.app/csip.jpg"
              alt="CSI Logo"
              className="h-10 w-auto rounded"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            <Link 
              to="/" 
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200"
            >
              Home
            </Link>

            {isLoggedIn ? (
              <>
                {isAdmin ? (
                  <Link 
                    to="/admin-dashboard" 
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200"
                  >
                    Admin Panel
                  </Link>
                ) : (
                  <Link 
                    to="/user-dashboard" 
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                )}

                <div className="flex items-center ml-3 pl-3 border-l border-gray-700">
                  <span className="text-sm font-medium text-gray-300 mr-3">Hello, {userName}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="ml-1 bg-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Signup
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            {menuOpen ? (
              <FaTimes className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <FaBars className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`md:hidden ${menuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800 shadow-lg">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
          >
            Home
          </Link>

          {isLoggedIn ? (
            <>
              {isAdmin ? (
                <Link
                  to="/admin-dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  Admin Panel
                </Link>
              ) : (
                <Link
                  to="/user-dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  Dashboard
                </Link>
              )}
              
              <div className="px-3 py-2 text-gray-300">
                Hello, {userName}
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium bg-red-600 text-white hover:bg-red-700 mt-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700 mt-2"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;