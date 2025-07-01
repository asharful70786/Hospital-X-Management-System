// src/pages/doctor/DoctorDashboard.jsx
import { Link } from "react-router-dom";

export default function DoctorDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">👨‍⚕️ Doctor Dashboard</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/doctor/patients" className="card bg-blue-100 hover:bg-blue-200 p-4 shadow-md rounded-xl">
          <h2 className="text-lg font-semibold">My Patients</h2>
          <p>View assigned patients</p>
        </Link>

        <Link to="/doctor/appointments" className="card bg-green-100 hover:bg-green-200 p-4 shadow-md rounded-xl">
          <h2 className="text-lg font-semibold">Appointments</h2>
          <p>Upcoming slots & schedule</p>
        </Link>

        <Link to="/doctor/prescriptions" className="card bg-purple-100 hover:bg-purple-200 p-4 shadow-md rounded-xl">
          <h2 className="text-lg font-semibold">Prescriptions</h2>
          <p>Create / View prescriptions</p>
        </Link>

        <Link to="/doctor/reports" className="card bg-yellow-100 hover:bg-yellow-200 p-4 shadow-md rounded-xl">
          <h2 className="text-lg font-semibold">Upload Reports</h2>
          <p>Attach lab or referral docs</p>
        </Link>
         <Link to="/doctor/availability" className="card bg-yellow-100 hover:bg-yellow-200 p-4 shadow-md rounded-xl">
          <h2 className="text-lg font-semibold">Availability Management</h2>
          <p>Availability Management</p>
        </Link>
         <Link to="/doctor/leaves" className="card bg-yellow-100 hover:bg-yellow-200 p-4 shadow-md rounded-xl">
          <h2 className="text-lg font-semibold">Leave Management</h2>
          <p>Leave Management</p>
        </Link>
        
      </div>
    </div>
  );
}
