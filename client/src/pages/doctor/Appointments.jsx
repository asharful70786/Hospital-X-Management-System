import { useEffect, useState, useContext } from 'react';
import { AuthContext } from "../../context/AuthContext";
import { motion } from "framer-motion";

export const useAuth = () => useContext(AuthContext);

function Appointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const BaseUrl = "http://localhost:4000";

  useEffect(() => {
    if (user?.role === "Doctor") {
      getDoctorAppointments(user._id);
    }
  }, [user]);

  async function getDoctorAppointments(doctorId) {
    try {
      const response = await fetch(`${BaseUrl}/appointment/by-doctor/${doctorId}`, {
        credentials: "include",
      });
      const data = await response.json();
      setAppointments(
        data.sort((a, b) => new Date(a.date) - new Date(b.date))
      );
    } catch (err) {
      console.error("Failed to fetch doctor appointments", err);
    }
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <motion.h2
        className="text-3xl font-extrabold text-indigo-600 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        📅 Upcoming Appointments
      </motion.h2>

      {appointments.length === 0 ? (
        <motion.div
          className="text-center text-gray-500 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No appointments scheduled.
        </motion.div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {appointments.map((appt, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-2xl shadow-lg p-5 border-l-4 border-indigo-500 hover:shadow-xl transition"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                👤 {appt.patient?.name || "Unknown"}
              </h3>
              <p className="text-sm text-gray-500 mb-1">
                📧 {appt.patient?.email || "No email"}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                📅 <strong>Date:</strong>{" "}
                {new Date(appt.date).toLocaleDateString()} &nbsp;
                ⏰ <strong>Time:</strong> {appt.time}
              </p>
              <span
                className={`inline-block mt-2 px-3 py-1 text-xs rounded-full font-medium ${
                  appt.status === "Scheduled"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {appt.status}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Appointments;
