import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationData, setRegistrationData] = useState({ fullName: "", email: "" });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`${API_URL}/api/events/${id}`);
        if (!response.ok) throw new Error("Event not found");

        const eventData = await response.json();
        setEvent(eventData);
        setIsRegistered(eventData.registrations?.some((reg) => reg.email === registrationData.email));
      } catch (error) {
        console.error("Error fetching event:", error);
        navigate("/");
      } finally {
        setLoading(false);
        setTimeout(() => setIsLoaded(true), 100);
      }
    };

    fetchEvent();

    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user?.role === "user") {
      setIsUser(true);
      setRegistrationData((prev) => ({ ...prev, email: user.email || "" }));
    }
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    if (!registrationData.fullName.trim() || !registrationData.email.trim()) {
      alert("Please fill in all registration fields");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/events/${id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      });

      if (!response.ok) throw new Error("Registration failed");

      alert("Registration successful!");
      setIsRegistered(true);
    } catch (error) {
      console.error("Registration error:", error);
      alert("Error registering for the event.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <div className="loader"></div>
      </div>
    );
  }

  if (!event) {
    return <div className="p-4 text-white">Event not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white transition-opacity duration-700 ease-in-out" style={{ opacity: isLoaded ? 1 : 0 }}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <img 
              src={event.image} 
              alt={event.name} 
              className="w-full max-w-md h-auto object-contain rounded-2xl shadow-2xl mx-auto transform transition hover:scale-105" 
            />
          </div>

          <div className="order-1 md:order-2 space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h2 className="text-4xl font-extrabold mb-2">{event.name}</h2>
              <p className="text-gray-400 text-lg">{event.description}</p>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 space-y-4">
              <div className="text-xl">Date & Time: {event.date} at {event.time}</div>
              <div className="text-xl">Location: {event.location}</div>
              {event.additionalDetails && (
                <div className="mt-4">
                  <h3 className="text-lg font-bold">Additional Details:</h3>
                  <p className="text-gray-300">{event.additionalDetails}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {isUser && (
          <div className="mt-12 max-w-xl mx-auto bg-gray-800 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-3xl font-bold text-center mb-6">Event Registration</h3>
            {isRegistered ? (
              <p className="text-center text-green-400 text-lg font-semibold">
                ✅ You are already registered for this event!
              </p>
            ) : (
              <div className="space-y-5">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={registrationData.fullName}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={registrationData.email}
                  className="w-full p-3 rounded-lg bg-gray-700 text-gray-400 border border-gray-600 focus:outline-none"
                  disabled
                />
                <button
                  onClick={handleRegister}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Register Now
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
