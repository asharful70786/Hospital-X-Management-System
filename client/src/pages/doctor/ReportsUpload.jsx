import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const useAuth = () => useContext(AuthContext);

function ReportsUpload() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    patient: '',
    notes: '',
    medicines: [{ name: '', dosage: '', frequency: '', duration: '' }],
    newPatientName: '',
    newPatientEmail: '',
  });
  const [addingNewPatient, setAddingNewPatient] = useState(false);

  const BaseUrl = "http://localhost:4000";

  useEffect(() => {
    if (user?.role === "Doctor") {
      fetch(`${BaseUrl}/appointment/by-doctor/${user._id}`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          const uniquePatients = data.reduce((acc, appt) => {
            const exists = acc.find(p => p._id === appt.patient._id);
            if (!exists) acc.push(appt.patient);
            return acc;
          }, []);
          setPatients(uniquePatients);
        })
        .catch(err => console.error("Failed to fetch patients", err));
    }
  }, [user]);

  const handleChange = (index, field, value) => {
    const updatedMeds = [...form.medicines];
    updatedMeds[index][field] = value;
    setForm({ ...form, medicines: updatedMeds });
  };

  const addMedicine = () => {
    setForm({ ...form, medicines: [...form.medicines, { name: '', dosage: '', frequency: '', duration: '' }] });
  };

  const removeMedicine = (index) => {
    const updated = form.medicines.filter((_, i) => i !== index);
    setForm({ ...form, medicines: updated });
  };

  const handleAddNewPatient = async () => {
    if (!form.newPatientName || !form.newPatientEmail) return toast.error("Enter name and email for new patient");
    try {
      const res = await fetch(`${BaseUrl}/staff/add-patient`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.newPatientName, email: form.newPatientEmail })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("New patient added");
        setPatients([...patients, data.user]);
        setForm({ ...form, patient: data.user._id, newPatientName: '', newPatientEmail: '' });
        setAddingNewPatient(false);
      } else {
        toast.error(data.message || "Failed to add patient");
      }
    } catch (err) {
      toast.error("Error adding patient");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patient || !form.notes || form.medicines.length === 0) {
      toast.error("Please fill all fields");
      return;
    }

    const payload = {
      doctor: user._id,
      patient: form.patient,
      notes: form.notes,
      medicines: form.medicines
    };

    try {
      const res = await fetch(`${BaseUrl}/prescriptions/add`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setForm({ patient: '', notes: '', medicines: [{ name: '', dosage: '', frequency: '', duration: '' }] });
      } else {
        toast.error(data.message || "Failed to upload prescription");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">📝 Add Prescription</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg space-y-4">
        <div>
          <label className="block font-semibold">Select Patient:</label>
          <select
            value={form.patient}
            onChange={(e) => setForm({ ...form, patient: e.target.value })}
            className="w-full mt-1 p-2 border rounded"
            required
          >
            <option value="">-- Select --</option>
            {patients.map((p) => (
              <option key={p._id} value={p._id}>{p.name} ({p.email})</option>
            ))}
          </select>
          <p className="text-sm mt-2">Can’t find patient? <button type="button" onClick={() => setAddingNewPatient(!addingNewPatient)} className="text-blue-600 underline">Add new patient</button></p>
        </div>

        {addingNewPatient && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Patient Name"
              value={form.newPatientName}
              onChange={(e) => setForm({ ...form, newPatientName: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="email"
              placeholder="Patient Email"
              value={form.newPatientEmail}
              onChange={(e) => setForm({ ...form, newPatientEmail: e.target.value })}
              className="p-2 border rounded"
            />
            <button type="button" onClick={handleAddNewPatient} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 col-span-2">✅ Add Patient</button>
          </div>
        )}

        <div>
          <label className="block font-semibold">Notes:</label>
          <textarea
            rows="3"
            className="w-full mt-1 p-2 border rounded"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Medicines:</label>
          {form.medicines.map((med, idx) => (
            <div key={idx} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <input
                type="text"
                placeholder="Name"
                value={med.name}
                onChange={(e) => handleChange(idx, 'name', e.target.value)}
                className="p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Dosage"
                value={med.dosage}
                onChange={(e) => handleChange(idx, 'dosage', e.target.value)}
                className="p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Frequency"
                value={med.frequency}
                onChange={(e) => handleChange(idx, 'frequency', e.target.value)}
                className="p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Duration"
                value={med.duration}
                onChange={(e) => handleChange(idx, 'duration', e.target.value)}
                className="p-2 border rounded"
                required
              />
              <button
                type="button"
                onClick={() => removeMedicine(idx)}
                className="text-red-600 font-semibold"
              >❌</button>
            </div>
          ))}
          <button type="button" onClick={addMedicine} className="text-blue-600 hover:underline">
            ➕ Add Medicine
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
        >
          Submit Prescription
        </button>
      </form>
    </div>
  );
}

export default ReportsUpload;
