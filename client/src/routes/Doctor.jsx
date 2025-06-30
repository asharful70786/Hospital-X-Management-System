// ✅ Doctor.jsx
import { Route } from "react-router-dom";
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import Patients from "../pages/doctor/Patients";

export const doctorRoutes = [
  <Route path="/doctor/dashboard" element={<DoctorDashboard />} key="doc-dashboard" />,
  <Route path="/doctor/patients" element={<Patients />} key="doc-patients" />
];

// export const doctorRoutes = [
//   <Route path="/dashboard" element={<DoctorDashboard />} key="dashboard" />,
//   // <Route path="/user/logs" element={<Adminlogs />} key="logs" />,{by super admin only}
//   //  GET appointments by doctor ID
//   <Route path="/by-doctor/:id" element={<ForgetPass />} key="by-doctor" />,
//   //GET all appointments for logged-in doctor (dashboard view) for receptionist
//   <Route path="/appointments" element={<ForgetPass  />} key="by-doctor" />, //get all appointments
//   //get availbe slots by doctor id for receptionist
//   <Route path="/available-slots/:id" element={<ForgetPass />} />,
//   <Route path="/by-doctor/:id" element={<ForgetPass />} key="by-doctor" />,
//   <Route path="/by-doctor/:id" element={<ForgetPass />} key="by-doctor" />,
//   <Route path="/by-doctor/:id" element={<ForgetPass />} key="by-doctor" />,
//   <Route path="/by-doctor/:id" element={<ForgetPass />} key="by-doctor" />,
// ];