import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  return (
    <div className="bg-gray-900 text-white p-4 rounded-xl shadow-lg h-full flex flex-col transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="overflow-hidden rounded-lg mb-4 w-full h-64">
        <img 
          src={event.image} 
          alt={event.name} 
          className="w-full h-full object-cover rounded-lg"
        />
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
          className="bg-blue-600 px-4 py-2 rounded-lg 
            hover:bg-blue-700 
            transition-all 
            duration-300 
            transform 
            hover:-translate-y-1 
            hover:shadow-lg 
            active:scale-95"
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

  const API_URL = import.meta.env.VITE_API_URL;

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
    <div className="p-4 bg-black min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Upcoming Events
      </h2>

      {events.length === 0 ? (
        <p className="text-center text-gray-400 text-xl">
          No events available. Add some events to get started!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
