import { Route } from "react-router-dom";
import ReceptionDashboard from "../pages/receptionist/ReceptionDashboard";
import Appointments from "../pages/receptionist/Appointments";

export const receptionRoutes = [
  <Route path="/reception/dashboard" element={<ReceptionDashboard />} key="reception-dashboard" />,
  <Route path="/reception/appointments" element={<Appointments />} key="reception-appointments" />
];