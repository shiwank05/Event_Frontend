import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);
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
        setUserName(user.fullName || user.email?.split('@')[0] || "User");
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

  // Detect scrolling for blur effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && !e.target.closest("nav")) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 shadow-lg border-b border-gray-800 transition-all duration-300 ${
        scrolling
          ? "bg-gray-950/80 backdrop-blur-md"
          : "bg-gray-950/95 backdrop-blur-none"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center">
            <img
              src="https://csiportal-eight.vercel.app/csip.jpg"
              alt="CSI Logo"
              className="h-10 w-auto rounded shadow-lg"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/" className="px-2.5 py-1.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors duration-200">
              Home
            </Link>

            {isLoggedIn ? (
              <>
                {isAdmin ? (
                  <Link to="/admin-dashboard" className="px-2.5 py-1.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors duration-200">
                    Admin Panel
                  </Link>
                ) : (
                  <Link to="/user-dashboard" className="px-2.5 py-1.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors duration-200">
                    Dashboard
                  </Link>
                )}

                <div className="flex items-center ml-2 pl-2 border-l border-gray-700">
                  <span className="text-sm font-medium text-gray-300 mr-2">Hello, {userName}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-700 transition duration-300 shadow-md"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="px-2.5 py-1.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors duration-200">
                  Login
                </Link>
                <Link to="/signup" className="ml-1 bg-blue-600 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-300 shadow-md">
                  Signup
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition duration-200"
          >
            <span className="sr-only">Open main menu</span>
            {menuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden fixed top-16 left-0 w-full bg-gray-900 shadow-lg transition-all duration-300 ease-in-out transform ${menuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}>
        <div className="px-4 py-3 space-y-1.5">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block px-2.5 py-1.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors duration-200">
            Home
          </Link>

          {isLoggedIn ? (
            <>
              {isAdmin ? (
                <Link to="/admin-dashboard" onClick={() => setMenuOpen(false)} className="block px-2.5 py-1.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors duration-200">
                  Admin Panel
                </Link>
              ) : (
                <Link to="/user-dashboard" onClick={() => setMenuOpen(false)} className="block px-2.5 py-1.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors duration-200">
                  Dashboard
                </Link>
              )}
              
              <div className="px-2.5 py-1.5 text-gray-300">
                Hello, {userName}
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-1.5 rounded-md text-base font-medium bg-red-600 text-white hover:bg-red-700 transition duration-300 shadow-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-2.5 py-1.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors duration-200">
                Login
              </Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="block px-3 py-1.5 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition duration-300 shadow-md">
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
