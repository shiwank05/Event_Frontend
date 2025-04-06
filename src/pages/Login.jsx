import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const redirectPath = location.state?.redirectTo || "/";

  //Disable browser back button when on login page
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const preventBack = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", preventBack);
    return () => {
      window.removeEventListener("popstate", preventBack);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("currentUser", JSON.stringify(data.user));

      navigate(redirectPath, { replace: true }); // ⬅️ use replace to prevent back nav
    } catch (err) {
      console.error("Login Error:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-200">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96 border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-400">Sign In</h2>

        {redirectPath !== "/" && (
          <div className="bg-blue-900/30 border-l-4 border-blue-500 text-white px-4 py-3 rounded mb-6 shadow-md">
            Sign in to continue with your registration
          </div>
        )}

        {error && (
          <div className="bg-red-900/80 border-l-4 border-red-500 text-white px-4 py-3 rounded mb-6 shadow-md">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label className="block text-blue-400 text-sm font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="bg-gray-700 border border-gray-600 text-white rounded w-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-blue-400 text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="bg-gray-700 border border-gray-600 text-white rounded w-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded w-full transition duration-300 shadow-md hover:shadow-blue-500/50"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-400 hover:text-blue-300">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
