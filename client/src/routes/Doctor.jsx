
import { Route } from "react-router-dom";
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import Patients from "../pages/doctor/Patients";
import Appointments from "../pages/doctor/Appointments";
import PrescriptionBoard from "../pages/doctor/PrescriptionBoard";
import ReportsUpload from "../pages/doctor/ReportsUpload";
import AvailabilityManager from "../pages/doctor/AvailabilityManager";
import LeaveManager from "../pages/doctor/LeaveManager";

export const doctorRoutes = [
  <Route path="/doctor/dashboard" element={<DoctorDashboard />} key="doc-dashboard" />,
  <Route path="/doctor/patients" element={<Patients />} key="doc-patients" />,
  <Route path="/doctor/appointments" element={<Appointments />} key="doc-appointments" />,
  <Route path="/doctor/prescriptions" element={<PrescriptionBoard />} key="doc-prescriptions" />,
  <Route path="/doctor/reports" element={<ReportsUpload />} key="doc-reports" />,
  <Route path="/doctor/availability" element={<AvailabilityManager />} key="doc-availability" />,
  <Route path="/doctor/leaves" element={<LeaveManager />} key="doc-leaves" />,
];

