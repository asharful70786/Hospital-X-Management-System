import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from "../../context/AuthContext";
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // ✅ must import directly

const useAuth = () => useContext(AuthContext);

function Patients() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const BaseUrl = 'http://localhost:4000';

  useEffect(() => {
    if (user?.role === 'Doctor') {
      fetch(`${BaseUrl}/appointment/by-doctor/${user._id}`, {
        credentials: 'include',
      })
        .then(res => res.json())
        .then(data => setAppointments(data))
        .catch(err => console.error('Error fetching appointments:', err));
    }
  }, [user]);

  // Deduplicate patients from appointments
  const uniquePatients = appointments.reduce((acc, appt) => {
    const existing = acc.find(p => p._id === appt.patient._id);
    if (!existing) acc.push(appt.patient);
    return acc;
  }, []);

  // PDF Export
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Doctor's Patient List", 14, 10);
    autoTable(doc, {
      head: [['Name', 'Email']],
      body: uniquePatients.map(p => [p.name, p.email]),
    });
    doc.save('doctor-patient-list.pdf');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">🧑‍⚕️ Your Patients</h2>

      <div className="flex gap-4 mb-4">
        <button
          onClick={exportPDF}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          📄 Export PDF
        </button>

        <CSVLink
          filename="doctor-patient-list.csv"
          data={uniquePatients.map(p => ({ Name: p.name, Email: p.email }))}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          📊 Export CSV
        </CSVLink>
      </div>

      {uniquePatients.length === 0 ? (
        <p className="text-gray-500">No patients assigned yet.</p>
      ) : (
        <ul className="space-y-3">
          {uniquePatients.map((p, i) => (
            <li key={i} className="border p-4 rounded shadow-sm">
              <strong>Name:</strong> {p.name} <br />
              <strong>Email:</strong> {p.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Patients;
