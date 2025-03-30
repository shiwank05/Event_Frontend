import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EventDetails from "./pages/EventDetails";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";

// ScrollToTop component to ensure pages start from the top
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

const App = () => (
  <Router>
    <ScrollToTop />
    <Navbar />
    <div className="pt-16 min-h-screen bg-black">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin-dashboard" element={<AdminPanel />} />
        <Route path="/user-dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  </Router>
);

export default App;