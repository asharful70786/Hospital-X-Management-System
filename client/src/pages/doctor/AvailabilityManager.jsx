import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

/* ---------- API HELPERS ---------- */
const BaseUrl = "http://localhost:4000";

/** GET /availability/:id  → [{ _id, weekday, slots:[…] }] */
const fetchAvailability = async docId => {
  const r = await fetch(`${BaseUrl}/availability/${docId}`, { credentials: "include" });
  if (!r.ok) throw new Error("Could not load availability");
  return await r.json();
};

/** POST /availability  { doctor, weekday, slots }  (create OR update) */
const saveAvailability = async payload => {
  const r = await fetch(`${BaseUrl}/availability`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error((await r.json()).message || "Failed to save");
  return await r.json();
};

/** DELETE /availability/:id */
const removeAvailability = async id => {
  const r = await fetch(`${BaseUrl}/availability/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!r.ok) throw new Error("Failed to delete");
};

/* ---------- WEEKDAY CONSTANT ---------- */
const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/* ---------- COMPONENT ---------- */
export default function AvailabilityManager({ doctorId }) {
  const [data, setData] = useState([]);        // [{ _id, weekday, slots }]
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const [form, setForm] = useState({ weekday: "Monday", time: "09:00" });

  /* initial fetch */
  useEffect(() => { refresh(); }, [doctorId]);

  async function refresh() {
    setLoading(true);
    try {
      setData(await fetchAvailability(doctorId));
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  /* ---------- helpers ---------- */
  const sortAsc = arr => [...arr].sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

  /* ---------- ADD SLOT ---------- */
  async function handleAdd(e) {
    e.preventDefault();
    const { weekday, time } = form;
    const hhmm = time.slice(0, 5);                // normalise "HH:mm"

    try {
      const dayDoc = data.find(d => d.weekday === weekday);
      const existing = dayDoc ? dayDoc.slots : [];

      if (existing.includes(hhmm)) {
        toast.error("Slot already exists");
        return;
      }

      const merged = sortAsc([...existing, hhmm]);
      await saveAvailability({ doctor: doctorId, weekday, slots: merged });
      toast.success("Saved");

      setData(prev =>
        dayDoc
          ? prev.map(d => (d.weekday === weekday ? { ...d, slots: merged } : d))
          : [...prev, { weekday, slots: merged }]
      );
    } catch (err) {
      toast.error(err.message);
    }
  }

  /* ---------- DELETE SLOT ---------- */
  async function delSlot(weekday, time) {
    const dayDoc = data.find(d => d.weekday === weekday);
    if (!dayDoc) return;

    const updated = dayDoc.slots.filter(t => t !== time);
    try {
      if (updated.length === 0) {
        await removeAvailability(dayDoc._id);
        setData(data.filter(d => d._id !== dayDoc._id));
      } else {
        await saveAvailability({ doctor: doctorId, weekday, slots: updated });
        setData(data.map(d => (d._id === dayDoc._id ? { ...d, slots: updated } : d)));
      }
    } catch (err) {
      toast.error(err.message);
    }
  }

  /* ---------- UI ---------- */
  if (loading) return <p className="p-6">Loading…</p>;
  if (error)   return <p className="p-6 text-rose-600">{error}</p>;

  return (
    <section className="p-6">
      <Toaster position="top-right" />
      <h2 className="text-xl font-semibold mb-4">Manage Weekly Availability</h2>

      {/* add-slot form */}
      <form onSubmit={handleAdd} className="flex flex-wrap gap-2 items-end mb-6">
        <select
          value={form.weekday}
          onChange={e => setForm({ ...form, weekday: e.target.value })}
          className="border p-2 rounded"
        >
          {WEEKDAYS.map(d => <option key={d}>{d}</option>)}
        </select>

        <input
          type="time"
          value={form.time}
          onChange={e => setForm({ ...form, time: e.target.value })}
          className="border p-2 rounded"
          required
        />

        <button className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">
          ➕ Add
        </button>
      </form>

      {/* weekday grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {WEEKDAYS.map(day => {
          const doc = data.find(d => d.weekday === day);
          return (
            <div key={day} className="border rounded p-3">
              <h3 className="font-semibold mb-2">{day}</h3>

              {doc ? (
                <ul className="space-y-1">
                  {doc.slots.map(t => (
                    <li key={t} className="flex justify-between items-center">
                      <span>{t}</span>
                      <button
                        onClick={() => delSlot(day, t)}
                        className="text-rose-600 text-xs hover:underline"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No slots</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
