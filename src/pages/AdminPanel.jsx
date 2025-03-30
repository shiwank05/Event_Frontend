import { useState, useEffect } from "react";

const AdminPanel = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const API_URL = import.meta.env.VITE_API_URL;

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
    setFormData({
      name: event.name,
      image: event.image,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      additionalDetails: event.additionalDetails
    });

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

      setEvents(prevEvents => prevEvents.map(event => (event._id === editId ? { ...event, ...formData } : event)));

      setEditId(null);
      setFormData({ name: "", image: "", description: "", date: "", time: "", location: "", additionalDetails: "" });

    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  // ✅ Delete Specific Registration
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-4 text-center">Admin Panel</h2>

      <div className="mb-4 space-y-2">
        <input name="name" className="border p-2 w-full rounded" placeholder="Event Name" value={formData.name} onChange={handleChange} />
        <input name="image" className="border p-2 w-full rounded" placeholder="Image URL" value={formData.image} onChange={handleChange} />
        <textarea name="description" className="border p-2 w-full rounded" placeholder="Event Description" value={formData.description} onChange={handleChange} />
        <input name="date" type="date" className="border p-2 w-full rounded" value={formData.date} onChange={handleChange} />
        <input name="time" type="time" className="border p-2 w-full rounded" value={formData.time} onChange={handleChange} />
        <input name="location" className="border p-2 w-full rounded" placeholder="Event Location" value={formData.location} onChange={handleChange} />
        <textarea name="additionalDetails" className="border p-2 w-full rounded" placeholder="Additional Event Details" value={formData.additionalDetails} onChange={handleChange} />

        {editId ? (
          <button onClick={updateEvent} className="bg-blue-500 text-white px-4 py-2 rounded w-full">Update Event</button>
        ) : (
          <button onClick={addEvent} className="bg-green-500 text-white px-4 py-2 rounded w-full">Add Event</button>
        )}
      </div>

      <ul className="space-y-3">
        {events.map((event) => (
          <li key={event._id} className="p-4 bg-gray-100 rounded flex flex-col gap-2">
            <h3 className="text-lg font-bold">{event.name}</h3>
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-auto max-h-96 object-contain rounded-lg"
            />

            <p className="text-sm">{event.description}</p>
            <p>Date: {event.date}</p>
            <p>Time: {event.time}</p>
            <p>Location: {event.location}</p>

            <div className="flex gap-2 mt-2">
              <button onClick={() => startEdit(event)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
              <button onClick={() => deleteEvent(event._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
            </div>

            {/* 🔹 Registrations Section */}
            {event.registrations && event.registrations.length > 0 && (
              <div className="mt-2 bg-gray-200 p-2 rounded">
                <h4 className="text-lg font-bold mb-2">Registrations</h4>
                <ul>
                  {event.registrations.map((reg) => (
                    <li key={reg._id} className="flex justify-between items-center bg-gray-300 p-2 rounded mb-1">
                      <span>{reg.fullName} - {reg.email}</span>
                      <button onClick={() => deleteRegistration(event._id, reg._id)} className="bg-red-500 text-white px-2 py-1 rounded">
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
