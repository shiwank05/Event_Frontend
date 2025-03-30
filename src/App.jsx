import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EventDetails from "./pages/EventDetails";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";

const App = () => (
  <Router>
    <Navbar />
    <div className="pt-16">
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
