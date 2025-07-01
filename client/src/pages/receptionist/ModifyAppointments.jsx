import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";


const BaseUrl = "http://localhost:4000";

const getAllAppointments = async () => {
  const res = await fetch(`${BaseUrl}/appointment`, { credentials: "include" });
  if (!res.ok) throw new Error("Could not fetch appointments");
  return res.json();
};

const cancelAppointment = async (id) => {
  const res = await fetch(`${BaseUrl}/appointment/update/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "Cancelled" }),
  });
  if (!res.ok) {
    if (res.status === 403) throw new Error("Access denied – Receptionist/Admin only");
    throw new Error("Failed to cancel appointment");
  }
};

export default function ModifyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch]             = useState("");
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setAppointments(await getAllAppointments());
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleCancel = async (id) => {
    try {
      await cancelAppointment(id);
      toast.success("Appointment cancelled");
     
      setAppointments(a => a.map(appt =>
        appt._id === id ? { ...appt, status: "Cancelled" } : appt
      ));
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  
  const term = search.toLowerCase();
  const displayed = appointments.filter(a =>
    (a.patient?.name || "").toLowerCase().includes(term) ||
    (a.patient?._id   || "").toLowerCase().includes(term)
  );

  /* ───── UI ───── */
  if (loading) return <p className="p-6">Loading…</p>;
  if (error)   return <p className="p-6 text-rose-600">{error}</p>;

  return (
    <section className="p-6">
      <Toaster position="top-right" />

      <input
        type="text"
        placeholder="Search patient ID or name…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4 px-4 py-2 border rounded w-full max-w-md focus:ring-2 focus:ring-indigo-500"
      />

      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Patient</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Time</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {displayed.length ? (
            displayed.map(a => (
              <tr key={a._id} className="hover:bg-gray-50">
                <td className="px-4 py-2">
                  <div className="font-medium">{a.patient?.name}</div>
                  <div className="text-xs text-gray-500">{a.patient?._id}</div>
                </td>
                <td className="px-4 py-2">{a.date.slice(0, 10)}</td>
                <td className="px-4 py-2">{a.time}</td>
                <td className="px-4 py-2">{a.status}</td>
                <td className="px-4 py-2">
                  {a.status !== "Cancelled" && (
                    <button
                      onClick={() => handleCancel(a._id)}
                      className="px-3 py-1 bg-rose-600 text-white rounded text-xs hover:bg-rose-700"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                No matching appointments
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
