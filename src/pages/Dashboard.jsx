import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));

        if (!currentUser) {
          navigate("/login");
          return;
        }

        setUser(currentUser);

        // Fetch registered events from backend
        const response = await fetch(`${API_URL}/api/events/user/${currentUser.email}/registrations`);
        if (!response.ok) throw new Error("Failed to fetch registrations");

        const events = await response.json();
        setRegisteredEvents(events);
      } catch (error) {
        console.error("Error fetching registered events:", error);
      }
    };

    fetchRegisteredEvents();
  }, [navigate, API_URL]);

  if (!user) {
    return (
      <div className="p-4 bg-black min-h-screen text-white flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-black min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Registered Events</h2>
      {registeredEvents.length === 0 ? (
        <div className="text-center text-gray-400 mt-10">
          <p className="mb-4">You have not registered for any events yet.</p>
          <Link to="/" className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {registeredEvents.map((event) => (
            <div key={event._id} className="bg-gray-900 rounded-xl p-4 shadow-lg flex flex-col">
              <img src={event.image} alt={event.name} className="w-full h-40 object-cover rounded-lg mb-4" />
              <h3 className="text-xl font-bold mb-2">{event.name}</h3>
              <p className="text-gray-400 mb-4 flex-grow">{event.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
