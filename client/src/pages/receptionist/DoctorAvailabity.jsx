import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import toast, { Toaster } from "react-hot-toast";

const BaseUrl   = "http://localhost:4000";
const TODAY_ISO = format(new Date(), "yyyy-MM-dd");
const TOTAL_SLOTS = 16;           


const fetchActiveDoctors = async () => {
  const res = await fetch(`${BaseUrl}/staff/by-role/Doctor`, { credentials: "include" });
  if (!res.ok) throw new Error("Could not load doctors");
  return (await res.json()).filter(d => d.isActive);
};

const fetchLeaveIds = async (dateISO) => {
   const res = await fetch(`${BaseUrl}/leave?date=${dateISO}`, { credentials: "include" });
  if (!res.ok) return [];
  return res.json();                     
};

const fetchBookedCount = async (doctorId, dateISO) => {
  const res = await fetch(`${BaseUrl}/availability/${doctorId}?date=${dateISO}`, {
    credentials: "include",
  });
  if (!res.ok) return 0;
  return (await res.json()).filter(s => s.isBooked).length;
};


export default function DoctorAvailability() {
  const [rows,    setRows]    = useState([]);        // final table rows
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [search,  setSearch]  = useState("");


  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [doctors, leaveIdArr] = await Promise.all([
          fetchActiveDoctors(),
          fetchLeaveIds(TODAY_ISO),
        ]);

        const leaveSet = new Set(leaveIdArr);
              const bookedPairs = await Promise.all(
          doctors.map(async d => [d.user._id, await fetchBookedCount(d.user._id, TODAY_ISO)])
        );
        const bookedMap = Object.fromEntries(bookedPairs);

        // assemble rows
        setRows(
          doctors.map(d => {
            const id     = d.user._id;
            const booked = bookedMap[id] ?? 0;
            return {
              id,
              name: d.user.name,
              dept: d.department?.name || "—",
              onLeave: leaveSet.has(id),
              booked,
              free: Math.max(TOTAL_SLOTS - booked, 0),
            };
          })
        );
      } catch (err) {
        console.error(err);
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);         
  const filteredRows = rows.filter(el =>
    (el.name + el.dept).toLowerCase().includes(search.toLowerCase())
  );

 
  if (loading) return <p className="p-6">Loading…</p>;
  if (error)   return <p className="p-6 text-rose-600">{error}</p>;

  return (
    <section className="p-6">
      <Toaster position="top-right" />

      <input
        type="text"
        placeholder="Search doctor or department…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4 px-4 py-2 border rounded w-full max-w-sm focus:ring-2 focus:ring-indigo-500"
      />

      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Doctor</th>
            <th className="px-4 py-2 text-left">Department</th>
            <th className="px-4 py-2 text-center">On&nbsp;Leave</th>
            <th className="px-4 py-2 text-right">Booked</th>
            <th className="px-4 py-2 text-right">Free</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {filteredRows.length ? (
            filteredRows.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{r.name}</td>
                <td className="px-4 py-2">{r.dept}</td>
                <td className="px-4 py-2 text-center">{r.onLeave ? "✅" : "—"}</td>
                <td className="px-4 py-2 text-right text-rose-600">{r.booked}</td>
                <td className="px-4 py-2 text-right text-emerald-600">{r.free}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                No doctors match your search.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
