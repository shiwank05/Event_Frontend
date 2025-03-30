import { useState, useEffect } from "react";

const AdminPanel = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedEventId, setExpandedEventId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    description: "",
    date: "",
    time: "",
    location: "",
    additionalDetails: ""
  });
  const [editId, setEditId] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/api/events`);
        if (!response.ok) throw new Error("Failed to fetch events");

        const eventsData = await response.json();
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [API_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addEvent = async () => {
    if (Object.values(formData).some(value => !value.trim())) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to add event");

      const newEvent = await response.json();
      setEvents([...events, newEvent]);
      setFormData({ name: "", image: "", description: "", date: "", time: "", location: "", additionalDetails: "" });

    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const deleteEvent = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/events/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete event");

      setEvents(events.filter((event) => event._id !== id));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const startEdit = (event) => {
    setEditId(event._id);
    setFormData(event);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateEvent = async () => {
    try {
      const response = await fetch(`${API_URL}/api/events/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update event");

      setEvents(prevEvents =>
        prevEvents.map(event => (event._id === editId ? { ...event, ...formData } : event))
      );

      setEditId(null);
      setFormData({ name: "", image: "", description: "", date: "", time: "", location: "", additionalDetails: "" });

    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const deleteRegistration = async (eventId, regId) => {
    try {
      const response = await fetch(`${API_URL}/api/events/${eventId}/registrations/${regId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete registration");

      setEvents(prevEvents =>
        prevEvents.map(event =>
          event._id === eventId
            ? { ...event, registrations: event.registrations.filter(reg => reg._id !== regId) }
            : event
        )
      );

      alert("Registration deleted successfully");
    } catch (error) {
      console.error("Error deleting registration:", error);
    }
  };

  const toggleRegistrations = (eventId) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden mb-8">
          <div className="bg-blue-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">
              {editId ? "Edit Event" : "Add New Event"}
            </h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm font-medium mb-1">Event Name</label>
                <input 
                  name="name" 
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                  placeholder="Enter event name" 
                  value={formData.name} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm font-medium mb-1">Image URL</label>
                <input 
                  name="image" 
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                  placeholder="Enter image URL" 
                  value={formData.image} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm font-medium mb-1">Description</label>
                <textarea 
                  name="description" 
                  rows="3"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                  placeholder="Enter event description" 
                  value={formData.description} 
                  onChange={handleChange}
                ></textarea>
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Date</label>
                <input 
                  name="date" 
                  type="date" 
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                  value={formData.date} 
                  onChange={handleChange} 
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Time</label>
                <input 
                  name="time" 
                  type="time" 
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                  value={formData.time} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm font-medium mb-1">Location</label>
                <input 
                  name="location" 
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                  placeholder="Enter event location" 
                  value={formData.location} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm font-medium mb-1">Additional Details</label>
                <textarea 
                  name="additionalDetails" 
                  rows="3"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                  placeholder="Enter additional details" 
                  value={formData.additionalDetails} 
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
            
            <div className="mt-4">
              {editId ? (
                <button 
                  onClick={updateEvent} 
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:translate-y-px"
                >
                  Update Event
                </button>
              ) : (
                <button 
                  onClick={addEvent} 
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:translate-y-px"
                >
                  Add Event
                </button>
              )}
            </div>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold mb-6 text-white text-center">Manage Events</h2>
        
        <div className="space-y-6">
          {events.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-300 text-lg">No events found. Add your first event above.</p>
            </div>
          ) : (
            events.map((event) => (
              <div key={event._id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/3">
                      <div className="rounded-lg overflow-hidden bg-gray-700 shadow-inner h-48">
                        <img 
                          src={event.image} 
                          alt={event.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="w-full md:w-2/3">
                      <h3 className="text-xl font-bold text-white mb-2">{event.name}</h3>
                      <p className="text-gray-300 mb-4 line-clamp-2">{event.description}</p>
                      
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="text-gray-400">
                          <span className="text-gray-500">Date:</span> {event.date}
                        </div>
                        <div className="text-gray-400">
                          <span className="text-gray-500">Time:</span> {event.time}
                        </div>
                        <div className="text-gray-400 col-span-2">
                          <span className="text-gray-500">Location:</span> {event.location}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        <button 
                          onClick={() => startEdit(event)} 
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => deleteEvent(event._id)} 
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
                        >
                          Delete
                        </button>
                        <button 
                          onClick={() => toggleRegistrations(event._id)} 
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
                        >
                          {expandedEventId === event._id ? "Hide Registrations" : "View Registrations"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {expandedEventId === event._id && (
                  <div className="border-t border-gray-700 bg-gray-750 p-6 transition-all duration-300 ease-in-out">
                    <h4 className="text-xl font-bold mb-4 text-white">Registrations</h4>
                    
                    {!event.registrations || event.registrations.length === 0 ? (
                      <p className="text-gray-400">No registrations for this event yet.</p>
                    ) : (
                      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                        {event.registrations.map((reg) => (
                          <div
                            key={reg._id}
                            className="bg-gray-700 rounded-lg p-4 border-l-4 border-blue-500 hover:shadow-lg transition-all duration-200"
                          >
                            <div className="space-y-2 mb-3">
                              <p className="text-white"><span className="text-gray-400">Name:</span> {reg.fullName}</p>
                              <p className="text-white"><span className="text-gray-400">Email:</span> {reg.email}</p>
                              <p className="text-white"><span className="text-gray-400">Phone:</span> {reg.phone}</p>
                              <p className="text-white"><span className="text-gray-400">College:</span> {reg.college}</p>
                              <p className="text-white"><span className="text-gray-400">Year:</span> {reg.year}</p>
                              <p className="text-white"><span className="text-gray-400">Department:</span> {reg.department}</p>
                              {reg.teamName && <p className="text-white"><span className="text-gray-400">Team:</span> {reg.teamName}</p>}
                            </div>
                            
                            <button
                              onClick={() => deleteRegistration(event._id, reg._id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-all duration-200 text-sm"
                            >
                              Delete Registration
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;