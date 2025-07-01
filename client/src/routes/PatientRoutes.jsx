import { Route } from "react-router-dom";

import MedicalHistory from "../pages/patient/MedicalHistory";
import PatientAppointments from "../pages/patient/Appointments";
import Billing from "../pages/patient/Billing";
import PatientDashboard from "../pages/patient/PatientDashboard";

export const patientRoutes = [
  <Route path="/patient/dashboard" element={<PatientDashboard />} key="patient-dashboard" />,
  <Route path="/patient/history" element={<MedicalHistory />} key="patient-history" />,
  <Route path="/patient/appointments" element={<PatientAppointments />} key="patient-appts" />,
  <Route path="/patient/billing" element={<Billing />} key="patient-billing" />
];
