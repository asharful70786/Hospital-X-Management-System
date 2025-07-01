import React, { useEffect, useState , useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { motion } from "framer-motion";
const useAuth = () => useContext(AuthContext);

function AvailabilityManager() {
  const { user } = useAuth();
  const [availability, setAvailability] = useState([]);
  const [weekday, setWeekday] = useState("Monday");
  const [slot, setSlot] = useState("");
  const BaseUrl = "http://localhost:4000";

  useEffect(() => {
    if (user?._id) fetchAvailability();
  }, [user]);

  async function fetchAvailability() {
    try {
      const res = await fetch(`${BaseUrl}/availability/${user._id}`, {
        credentials: "include",
      });
      const data = await res.json();
      setAvailability(data);
    } catch (err) {
      console.error("Failed to load availability", err);
    }
  }

  async function handleAddSlot(e) {
    e.preventDefault();
    if (!slot.trim()) return;

    try {
      const existing = availability.find(a => a.weekday === weekday);
      const newSlots = existing ? [...new Set([...existing.slots, slot])] : [slot];

      const res = await fetch(`${BaseUrl}/availability`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctor: user._id,
          weekday,
          slots: newSlots,
        }),
      });

      if (res.ok) {
        fetchAvailability();
        setSlot("");
      }
    } catch (err) {
      console.error("Failed to add slot", err);
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`${BaseUrl}/availability/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) fetchAvailability();
    } catch (err) {
      console.error("Delete failed", err);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.h2
        className="text-2xl font-bold text-indigo-600 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🕒 Manage Weekly Availability
      </motion.h2>

      <form onSubmit={handleAddSlot} className="bg-white p-4 mb-8 rounded-xl shadow space-y-4">
        <div>
          <label className="block font-semibold">Weekday</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={weekday}
            onChange={(e) => setWeekday(e.target.value)}
          >
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold">Time Slot (e.g., 10:00)</label>
          <input
            type="text"
            required
            className="w-full border rounded px-3 py-2"
            value={slot}
            onChange={(e) => setSlot(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Add Slot
        </button>
      </form>

      {availability.length === 0 ? (
        <p className="text-gray-500">No availability set yet.</p>
      ) : (
        availability.map((entry, i) => (
          <div
            key={i}
            className="bg-gray-50 mb-4 p-4 rounded-xl shadow border-l-4 border-indigo-500"
          >
            <div className="font-semibold text-indigo-700">{entry.weekday}</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {entry.slots.map((s, idx) => (
                <span
                  key={idx}
                  className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                >
                  {s}
                </span>
              ))}
            </div>
                    <p>Availability For  2 hour</p>
            <button
              onClick={() => handleDelete(entry._id)}
              className="mt-3 text-red-600 text-sm hover:underline"
            >
              Delete This Day's Availability
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default AvailabilityManager;
