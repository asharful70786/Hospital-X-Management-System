import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

export default function AddAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    doctor: "", date: "", time: "",
    department: "", symptoms: ""
  });

  // Fetch doctors
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:4000/staff/by-role/Doctor", {
          credentials: "include",
        });
        setDoctors(await res.json());
      } catch (err) {
        console.error(err);
        setError("Could not load doctor list");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const activeDocs = doctors
    .filter(d => d.isActive)
    .map(d => ({
      userId: d.user._id,
      name: d.user.name,
      dept: d.department?.name || "—"
    }));

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // quick-create minimal patient record
      const userRes = await fetch("http://localhost:4000/user/quick-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
        }),
      });
      const { _id: patient } = await userRes.json();

      // create appointment
      await fetch("http://localhost:4000/appointment/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          patient,
          doctor: form.doctor,
          department: form.department,
          date: form.date,
          time: form.time,
          status: "Scheduled",
          symptoms: form.symptoms,
        }),
      });

      toast.success("Appointment booked successfully!");
      setShow(false);
      setForm({
        name: "", email: "", phone: "",
        doctor: "", date: "", time: "",
        department: "", symptoms: ""
      });
    } catch (err) {
      console.error(err);
      toast.error("Could not book appointment");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="p-6 bg-rose-50 rounded-lg border border-rose-200 text-rose-600 text-center">
      {error}
    </div>
  );

  return (
    <section className="p-6 max-w-6xl mx-auto">
      <Toaster position="top-right" toastOptions={{
        style: {
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }
      }} />
      
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShow(true)}
        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Book New Appointment
      </motion.button>

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShow(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                <h2 className="text-2xl font-bold">Schedule New Appointment</h2>
                <p className="opacity-90">Fill in the details to book an appointment</p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Patient Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          id="name" name="name" placeholder="John Doe" value={form.name}
                          onChange={handleChange} required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          id="email" type="email" name="email" placeholder="john@example.com" value={form.email}
                          onChange={handleChange} required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          id="phone" name="phone" placeholder="+1 (555) 123-4567" value={form.phone}
                          onChange={handleChange} required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Appointment Details</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="doctor" className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                        <select
                          id="doctor" name="doctor" value={form.doctor}
                          onChange={handleChange} required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        >
                          <option value="">Select a doctor</option>
                          {activeDocs.map(doc => (
                            <option key={doc.userId} value={doc.userId}>
                              Dr. {doc.name}{doc.dept !== "—" && ` (${doc.dept})`}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                        <input
                          id="department" name="department" placeholder="Cardiology, Neurology, etc."
                          value={form.department} onChange={handleChange} required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                      </div>
                      <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                          id="date" type="date" name="date" value={form.date}
                          onChange={handleChange} required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                      </div>
                      <div>
                        <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                        <input
                          id="time" type="time" name="time" value={form.time}
                          onChange={handleChange} required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">Symptoms (Optional)</label>
                    <textarea
                      id="symptoms" name="symptoms" rows="3" placeholder="Describe any symptoms or concerns..."
                      value={form.symptoms} onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <motion.button
                    type="button"
                    onClick={() => setShow(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow hover:shadow-md transition"
                  >
                    Confirm Appointment
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}