import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  return (
    <div className="bg-gray-900 text-white p-5 rounded-xl shadow-lg h-full flex flex-col transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-800">
      <div className="overflow-hidden rounded-lg mb-4 w-full h-64 relative">
        <img 
          src={event.image} 
          alt={event.name} 
          className="w-full h-full object-cover rounded-lg transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
      </div>
      <h3 className="text-xl font-bold text-center mb-2 transition-colors duration-300 hover:text-blue-400">
        {event.name}
      </h3>
      <p className="text-sm text-gray-400 mb-4 text-center opacity-80 hover:opacity-100 transition-opacity duration-300 flex-grow">
        {event.description}
      </p>
      <div className="flex justify-center mt-auto">
        <Link 
          to={`/event/${event._id}`} 
          className="bg-blue-600 px-5 py-2 rounded-lg 
            hover:bg-blue-700 
            transition-all 
            duration-300 
            transform 
            hover:-translate-y-1 
            hover:shadow-lg 
            active:scale-95
            w-full text-center font-medium"
        >
          Know More
        </Link>
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
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h2 className="text-4xl font-bold mb-8 text-center">
        Upcoming <span className="text-blue-500">Events</span>
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