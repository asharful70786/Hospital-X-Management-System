import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";

const badgeColors = {
  Scheduled: "bg-emerald-100 text-emerald-700",
  Completed: "bg-blue-100 text-blue-700",
  Cancelled: "bg-rose-100 text-rose-700",
  Pending: "bg-yellow-100 text-yellow-700",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${badgeColors[status] || "bg-gray-100 text-gray-700"}`}
    >
      {status}
    </span>
  );
}

 function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch("http://localhost:4000/appointment", {
          credentials: "include",
        });
        const data = await res.json();
        setAppointments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch appointments", err);
        setError("Oops, couldn’t load appointments.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const filterFn = (appt) =>
      appt.status !== "Cancelled" &&
      (
        appt.patient?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appt.doctor?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return appointments.filter(filterFn).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [appointments, searchQuery]);

  if (loading) return <p className="p-6">Loading appointments…</p>;
  if (error) return <p className="p-6 text-rose-600">{error}</p>;

  return (
    <section className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-4 flex items-center gap-3"
      >
        <input
          type="text"
          placeholder="🔍 Search by patient or doctor..."
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          >
            Clear
          </button>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-full overflow-x-auto rounded-lg shadow-md"
      >
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 text-left font-medium">#</th>
              <th className="px-4 py-2 text-left font-medium">Date</th>
              <th className="px-4 py-2 text-left font-medium">Time</th>
              <th className="px-4 py-2 text-left font-medium">Patient</th>
              <th className="px-4 py-2 text-left font-medium">Doctor</th>
              <th className="px-4 py-2 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((a, idx) => (
              <tr key={a._id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">{format(new Date(a.date), "dd MMM yyyy")}</td>
                <td className="px-4 py-2">{a.time}</td>
                <td className="px-4 py-2">{a.patient?.name}</td>
                <td className="px-4 py-2">{a.doctor?.name}</td>
                <td className="px-4 py-2"><StatusBadge status={a.status} /></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  No matching appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </section>
  );
}


export default Appointments