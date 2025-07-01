import React, { useEffect, useState , useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { motion } from "framer-motion";

const useAuth = () => useContext(AuthContext);

function LeaveManager() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const BaseUrl = "http://localhost:4000";

  useEffect(() => {
    if (user?._id) fetchLeaves();
  }, [user]);

  async function fetchLeaves() {
    try {
      const res = await fetch(`${BaseUrl}/leave/by-doctor/${user._id}`, {
        credentials: "include",
      });
      const data = await res.json();
      setLeaves(data);
    } catch (error) {
      console.error("Failed to load leaves", error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${BaseUrl}/leave/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ doctor: user._id, date, reason }),
      });
      const data = await res.json();
      if (res.ok) {
        fetchLeaves(); // refresh list
        setDate("");
        setReason("");
      } else {
        console.error("Leave request failed", data.message);
      }
    } catch (error) {
      console.error("Error submitting leave", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.h2
        className="text-2xl font-bold text-indigo-600 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🌴 Manage Leave Requests
      </motion.h2>

      <form onSubmit={handleSubmit} className="mb-10 bg-white p-4 rounded-xl shadow-md space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Leave Date</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Reason</label>
          <textarea
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <button
          disabled={loading}
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          {loading ? "Submitting..." : "Apply for Leave"}
        </button>
      </form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-3"
      >
        <h3 className="text-lg font-semibold text-gray-700 mb-2">📋 My Leaves</h3>
        {leaves.length === 0 ? (
          <p className="text-gray-500">No leave records yet.</p>
        ) : (
          leaves.map((leave, i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-3 shadow-sm border-l-4 border-green-500">
              <div><strong>📅 Date:</strong> {new Date(leave.date).toLocaleDateString()}</div>
              <div><strong>✍️ Reason:</strong> {leave.reason}</div>
              <div><strong>Status:</strong> {leave.status || "Pending"}</div>
            </div>
          ))
        )}
      </motion.div>
    </div>
  );
}

export default LeaveManager;
