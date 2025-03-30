import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "user",
    adminKey: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    if (formData.role === "admin") {
      payload.adminKey = formData.adminKey;
    }

    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      navigate("/login");
    } catch (err) {
      console.error("Signup Error:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="bg-gray-900 p-5 rounded-lg shadow-lg w-96 border border-gray-800">
        <h2 className="text-2xl font-bold text-center mb-4 text-white">
          Create Account
        </h2>

        {error && (
          <div className="bg-red-900 border-l-4 border-red-500 text-white px-3 py-2 rounded mb-3 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label
              className="block text-blue-400 text-xs font-medium mb-1"
              htmlFor="fullName"
            >
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              className="bg-gray-800 border border-gray-700 text-white rounded w-full py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="mb-3">
            <label
              className="block text-blue-400 text-xs font-medium mb-1"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="bg-gray-800 border border-gray-700 text-white rounded w-full py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-3">
            <label
              className="block text-blue-400 text-xs font-medium mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="bg-gray-800 border border-gray-700 text-white rounded w-full py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="mb-3">
            <label
              className="block text-blue-400 text-xs font-medium mb-1"
              htmlFor="role"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              className="bg-gray-800 border border-gray-700 text-white rounded w-full py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {formData.role === "admin" && (
            <div className="mb-3">
              <label
                className="block text-blue-400 text-xs font-medium mb-1"
                htmlFor="adminKey"
              >
                Admin Secret Key
              </label>
              <input
                id="adminKey"
                name="adminKey"
                type="password"
                className="bg-gray-800 border border-gray-700 text-white rounded w-full py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                value={formData.adminKey}
                onChange={handleChange}
                placeholder="Enter admin key"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded w-full transition duration-200 text-sm mt-2"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-3 text-gray-400 text-xs">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;