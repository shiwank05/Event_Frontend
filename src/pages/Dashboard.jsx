import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) {
          navigate("/login");
          return;
        }

        setUser(currentUser);

        const response = await fetch(`${API_URL}/api/events/user/${currentUser.email}/registrations`);
        if (!response.ok) throw new Error("Failed to fetch registrations");

        const events = await response.json();
        setRegisteredEvents(events);
      } catch (err) {
        console.error("Error fetching registered events:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRegisteredEvents();
  }, [navigate, API_URL]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="flex flex-col items-center p-8 space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl font-medium text-gray-200">Loading your events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-100">
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg text-center">
          <p className="text-lg text-red-400">Error: {error}</p>
          <Link
            to="/"
            className="mt-4 inline-block px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      {/* Header Section */}
      <header className=" bg-gray-900 bg-opacity-80 backdrop-blur-sm shadow-lg">
        <div className="container px-4 py-5 mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Your Events Dashboard
          </h1>
          <Link 
            to="/" 
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition duration-300"
          >
            Browse Events
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8 mx-auto max-w-full">
        <section>
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-200">
            <span className="border-b-2 border-blue-500 pb-1">Your Registered Events</span>
          </h2>

          {registeredEvents.length === 0 ? (
            <div className="mt-10 p-8 bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-xl shadow-lg text-center border border-gray-700 max-w-3xl mx-auto">
              <svg className="w-16 h-16 mx-auto text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <p className="text-xl text-gray-400 mb-6">You haven't registered for any events yet</p>
              <Link
                to="/"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-300 shadow-lg"
              >
                Find Events to Join
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {registeredEvents.map((event) => {
                const registration = event.registrations?.[0] || {};
                return (
                  <div
                    key={event._id}
                    className="overflow-hidden bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700 transition-all duration-300 hover:shadow-blue-900/20 hover:border-blue-900/50 w-full"
                  >
                    {/* Event Header */}
                    <div className="p-8 border-b border-gray-700">
                      <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        {event.name}
                      </h3>
                      {event.date && (
                        <p className="text-gray-400 mt-2 flex items-center text-lg">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          {event.date}
                        </p>
                      )}
                    </div>

                    {/* Event Content */}
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-1/4 relative">
                        <img
                          src={event.image || "/default-event.jpg"}
                          alt={event.name}
                          className="w-full h-full object-cover object-center min-h-[280px]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                      </div>

                      <div className="w-full md:w-3/4 flex flex-col">
                        <div className="p-8 border-b border-gray-700">
                          <p className="text-gray-300 text-lg leading-relaxed">{event.description}</p>
                        </div>

                        {/* Compact Registration Details Section */}
                        <div className="p-6 bg-gray-800 bg-opacity-30">
                          <h4 className="text-lg font-semibold mb-3 text-blue-400 border-b border-gray-700 pb-2">
                            Registration Details
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <div className="bg-gray-800 bg-opacity-40 p-2 rounded">
                              <p className="text-gray-400 text-xs">Name</p>
                              <p className="font-medium text-sm">{registration.fullName || "N/A"}</p>
                            </div>
                            
                            <div className="bg-gray-800 bg-opacity-40 p-2 rounded">
                              <p className="text-gray-400 text-xs">Email</p>
                              <p className="font-medium text-sm">{registration.email || "N/A"}</p>
                            </div>
                            
                            <div className="bg-gray-800 bg-opacity-40 p-2 rounded">
                              <p className="text-gray-400 text-xs">Phone</p>
                              <p className="font-medium text-sm">{registration.phone || "N/A"}</p>
                            </div>
                            
                            <div className="bg-gray-800 bg-opacity-40 p-2 rounded">
                              <p className="text-gray-400 text-xs">College</p>
                              <p className="font-medium text-sm">{registration.college || "N/A"}</p>
                            </div>
                            
                            <div className="bg-gray-800 bg-opacity-40 p-2 rounded">
                              <p className="text-gray-400 text-xs">Year</p>
                              <p className="font-medium text-sm">{registration.year || "N/A"}</p>
                            </div>
                            
                            <div className="bg-gray-800 bg-opacity-40 p-2 rounded">
                              <p className="text-gray-400 text-xs">Department</p>
                              <p className="font-medium text-sm">{registration.department || "N/A"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;