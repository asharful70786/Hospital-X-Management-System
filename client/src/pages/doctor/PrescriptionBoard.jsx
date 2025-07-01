import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const useAuth = () => useContext(AuthContext);

function PrescriptionBoard() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const BaseUrl = "http://localhost:4000";

  useEffect(() => {
    if (user?.role === "Doctor") {
      fetch(`${BaseUrl}/prescriptionS/by-doctor/${user._id}`, {
        credentials: "include"
      })
        .then(res => res.json())
        .then(data => setPrescriptions(data))
        .catch(err => console.error("Error fetching prescriptions:", err));
    }
  }, [user]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-blue-900 mb-6">📝 Your Prescriptions</h2>
      
      {prescriptions.length === 0 ? (
        <p className="text-gray-600 text-lg">No prescriptions found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prescriptions.map((pres, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition duration-300"
            >
              <div className="mb-2">
                <p className="text-lg font-semibold text-gray-800">
                  👤 Patient: <span className="text-gray-700">{pres.patient?.name}</span>
                </p>
                <p className="text-sm text-gray-500">📧 {pres.patient?.email}</p>
              </div>

              <div className="mt-4">
                <h4 className="text-md font-medium text-indigo-600 mb-2">💊 Medicine Durations</h4>
                {pres.medicines?.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    {pres.medicines.map((med, i) => (
                      <li key={i}>Duration: {med.duration} days</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No medicines listed.</p>
                )}
              </div>

              <p className="mt-4 text-xs text-gray-400">
                📅 Issued on: {new Date(pres.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PrescriptionBoard;
