import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication status whenever route changes
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
        setUserName(user.email?.split('@')[0] || "User");
      } catch (err) {
        // Handle invalid JSON in localStorage
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
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gray-800/70 backdrop-blur-md text-white p-4 flex justify-between items-center h-16">
      <Link to="/">
        <img
          src="https://csiportal-eight.vercel.app/csip.jpg"
          alt="CSI Logo"
          className="h-10 w-auto"
        />
      </Link>


      <div className="space-x-4 flex items-center">
        <Link to="/" className="hover:text-gray-300 transition-colors">Home</Link>

        {isLoggedIn ? (
          <>
            {isAdmin ? (
              <Link to="/admin-dashboard" className="hover:text-gray-300 transition-colors">
                Admin Panel
              </Link>
            ) : (
              <Link to="/user-dashboard" className="hover:text-gray-300 transition-colors">
                Dashboard
              </Link>
            )}

            <div className="flex items-center">
              <span className="text-gray-300 mr-3">Hello, {userName}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-gray-300 transition-colors">
              Login
            </Link>
            <Link to="/signup" className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 transition-colors">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;