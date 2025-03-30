import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "",
    year: "",
    department: "",
    teamName: "",
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`${API_URL}/api/events/${id}`);
        if (!response.ok) throw new Error("Event not found");

        const eventData = await response.json();
        
        // Format the date to dd-mm-yyyy if it exists
        if (eventData.date) {
          const dateObj = new Date(eventData.date);
          const day = String(dateObj.getDate()).padStart(2, '0');
          const month = String(dateObj.getMonth() + 1).padStart(2, '0');
          const year = dateObj.getFullYear();
          eventData.formattedDate = `${day}-${month}-${year}`;
        }
        
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
    if (
      !registrationData.fullName.trim() ||
      !registrationData.email.trim() ||
      !registrationData.phone.trim() ||
      !registrationData.college.trim() ||
      !registrationData.year.trim() ||
      !registrationData.department.trim() ||
      !registrationData.teamName.trim()
    ) {
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
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-black">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="bg-gray-800 rounded-xl p-8 text-center shadow-xl">
          <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
          <p className="mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white transition-all duration-700 ease-in-out" style={{ opacity: isLoaded ? 1 : 0 }}>
      {/* Hero Banner */}
      <div className="relative h-64 md:h-96 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-80"></div>
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-2 text-white drop-shadow-lg">{event.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span>{event.formattedDate || event.date}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{event.time}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>{event.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Event Details */}
        <div className="max-w-6xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl mb-12">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 inline-block border-b-2 border-blue-500 pb-2">About This Event</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">{event.description}</p>

              {event.additionalDetails && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-3">Additional Information</h3>
                  <p className="text-gray-300">{event.additionalDetails}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-auto rounded-2xl shadow-2xl transform transition hover:scale-105 hover:rotate-1"
              />
            </div>
          </div>
        </div>

        {/* Registration Form */}
        {isUser && (
          <div className="max-w-xl mx-auto">
            <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700">
              <h3 className="text-2xl font-bold mb-6 text-center">
                {isRegistered ? "Registration Complete" : "Register for Event"}
              </h3>

              {isRegistered ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-green-500 mx-auto flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <p className="text-xl font-medium text-green-400 mb-2">You're all set!</p>
                  <p className="text-gray-300 mb-6">You have successfully registered for this event.</p>
                  <button
                    onClick={() => navigate("/")}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Browse More Events
                  </button>
                </div>
              ) : (
                <div>
                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                        <input
                          type="text"
                          name="fullName"
                          value={registrationData.fullName}
                          onChange={handleInputChange}
                          className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={registrationData.email}
                          className="w-full p-2 rounded-md bg-gray-700/50 text-gray-400 border border-gray-600"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                        <input
                          type="text"
                          name="phone"
                          value={registrationData.phone}
                          onChange={handleInputChange}
                          className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-400 mb-1">College Name</label>
                        <input
                          type="text"
                          name="college"
                          value={registrationData.college}
                          onChange={handleInputChange}
                          className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Year</label>
                        <input
                          type="text"
                          name="year"
                          value={registrationData.year}
                          onChange={handleInputChange}
                          className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Department</label>
                        <input
                          type="text"
                          name="department"
                          value={registrationData.department}
                          onChange={handleInputChange}
                          className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Team</label>
                        <input
                          type="text"
                          name="teamName"
                          value={registrationData.teamName}
                          onChange={handleInputChange}
                          className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleRegister}
                    className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition font-medium"
                  >
                    Register Now
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;