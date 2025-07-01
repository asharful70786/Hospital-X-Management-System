import { Route } from "react-router-dom";
import ReceptionDashboard from "../pages/receptionist/ReceptionDashboard";
import Appointments from "../pages/receptionist/Appointments";
// import PatientSummery from "../pages/receptionist/PatientSummery";
import AddNewPatient from "../pages/receptionist/AddNewPatient";
import ModifyAppointments from "../pages/receptionist/ModifyAppointments";
// import Reports from "../pages/receptionist/Reports";
import DoctorAvailabity from "../pages/receptionist/DoctorAvailabity";
import Ward_bedAvailability from "../pages/receptionist/Ward-bedAvailability";

export const receptionRoutes = [
  <Route path="/receptionist/dashboard" element={<ReceptionDashboard />} key="reception-dashboard" />,
  <Route path="/receptionist/appointments" element={<Appointments />} key="reception-appointments" />,
  // <Route path="/receptionist/patients" element={ <PatientSummery/>} key="receptionist-patients" />,
  <Route path="/receptionist/add-new-patient" element={<AddNewPatient />} key="receptionist-add-new-patient" />,
  <Route path="/receptionist/modify-appointments" element={<ModifyAppointments />} key="receptionist-modify-appointments" />,
  // <Route path="/receptionist/reports" element={<Reports />} key="receptionist-reports" />,
  <Route path="/receptionist/doctors-availability" element={<DoctorAvailabity />} key="receptionist-doctors-availability" />,
  <Route path="/receptionist/Ward_bedAvailability" element={< Ward_bedAvailability />} key="receptionist-docs-on-leaves" />,

];