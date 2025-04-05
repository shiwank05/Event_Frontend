import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const EventCard = ({ event }) => {
  const [isUser, setIsUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user?.role === "user") {
      setIsUser(true);
    } else if (user?.role === "admin") {
      setIsAdmin(true);
    }
  }, []);

  const handleRegisterClick = (e) => {
    e.preventDefault();
    if (isUser) {
      navigate(`/event/${event._id}`);
    } else {
      navigate("/login", { state: { redirectTo: `/event/${event._id}` } });
    }
  };

  // Format date nicely
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-gray-800 text-gray-200 p-5 rounded-xl shadow-lg h-full flex flex-col transform transition-all duration-300 hover:scale-102 hover:shadow-xl hover:shadow-blue-900/30 border border-gray-700">
      <div className="overflow-hidden rounded-lg mb-4 w-full h-64 relative">
        <img 
          src={event.image} 
          alt={event.name} 
          className="w-full h-full object-cover rounded-lg transition-transform duration-500 hover:scale-110"
        />
        {/* Event type badge */}
        {event.category && (
          <div className="absolute top-3 right-3 bg-blue-600 text-xs font-bold px-3 py-1 rounded-full">
            {event.category}
          </div>
        )}
      </div>
      
      <h3 className="text-xl font-bold text-center mb-3 transition-colors duration-300 hover:text-blue-400">
        {event.name}
      </h3>
      
      {/* Event details section */}
      <div className="mb-4 flex flex-col gap-2">
        {/* Date information */}
        <div className="flex items-center text-gray-300">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <span className="text-sm">{event.date ? formatDate(event.date) : "Date TBA"}</span>
        </div>
        
        {/* Location information */}
        <div className="flex items-center text-gray-300">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span className="text-sm">{event.location || "Location TBA"}</span>
        </div>
      </div>
      
      <p className="text-sm text-gray-400 mb-6 opacity-80 hover:opacity-100 transition-opacity duration-300 flex-grow">
        {event.description}
      </p>
      
      {/* Progress bar for seats/capacity */}
      {event.capacity && event.registered && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span>{event.registered} registered</span>
            <span>{event.capacity} total</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full" 
              style={{ width: `${Math.min(100, (event.registered / event.capacity) * 100)}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <div className="flex gap-3 mt-auto">
        <Link 
          to={`/event/${event._id}`} 
          className="bg-blue-600 px-4 py-2 rounded-lg 
            hover:bg-blue-700 
            transition-all 
            duration-300 
            transform 
            hover:-translate-y-1 
            hover:shadow-lg 
            active:scale-95
            text-center font-medium flex-1"
        >
          Know More
        </Link>

        {!isAdmin && (
          <button 
            onClick={handleRegisterClick}
            className="bg-green-600 px-4 py-2 rounded-lg 
              hover:bg-green-700 
              transition-all 
              duration-300 
              transform 
              hover:-translate-y-1 
              hover:shadow-lg 
              active:scale-95
              text-center font-medium flex-1"
          >
            Register Now
          </button>
        )}
      </div>
    </div>
  );
};

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/api/events`);
        if (!response.ok) throw new Error("Failed to fetch events");

        const eventData = await response.json();
        setEvents(eventData);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [API_URL]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-gray-200">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-gray-200">
      <h2 className="text-4xl font-bold mb-12 text-center">
        Upcoming <span className="text-blue-400">Events</span>
      </h2>

      {events.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400 text-xl mb-4">
            No events available. Add some events to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;