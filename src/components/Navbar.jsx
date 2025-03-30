import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa"; // Icons for toggle button

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

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gray-800/70 backdrop-blur-md text-white p-4 flex justify-between items-center h-16">
      {/* Logo */}
      <Link to="/" onClick={() => setMenuOpen(false)}>
        <img
          src="https://csiportal-eight.vercel.app/csip.jpg"
          alt="CSI Logo"
          className="h-10 w-auto"
        />
      </Link>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-white text-2xl focus:outline-none"
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Menu */}
      <div
        className={`absolute md:static top-16 right-0 md:flex md:items-center md:space-x-6 bg-gray-900 md:bg-transparent w-3/4 md:w-auto h-screen md:h-auto p-6 md:p-0 transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
        }`}
      >
        <Link to="/" onClick={() => setMenuOpen(false)} className="block md:inline py-2 px-4 hover:text-gray-300">
          Home
        </Link>

        {isLoggedIn ? (
          <>
            {isAdmin ? (
              <Link to="/admin-dashboard" onClick={() => setMenuOpen(false)} className="block md:inline py-2 px-4 hover:text-gray-300">
                Admin Panel
              </Link>
            ) : (
              <Link to="/user-dashboard" onClick={() => setMenuOpen(false)} className="block md:inline py-2 px-4 hover:text-gray-300">
                Dashboard
              </Link>
            )}

            <div className="md:flex items-center space-y-4 md:space-y-0">
              <span className="text-gray-300 block md:inline py-2 px-4">Hello, {userName}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 w-full md:w-auto px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block md:inline py-2 px-4 hover:text-gray-300">
              Login
            </Link>
            <Link to="/signup" onClick={() => setMenuOpen(false)} className="block md:inline bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-colors">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
