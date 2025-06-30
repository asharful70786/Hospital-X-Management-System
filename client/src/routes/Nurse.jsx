// ✅ Nurse.jsx
import { Route } from "react-router-dom";
import NurseDashboard from "../pages/nurse/NurseDashboard";
import AssignedPatients from "../pages/nurse/AssignedPatients";

export const nurseRoutes = [
  <Route path="/nurse/dashboard" element={<NurseDashboard />} key="nurse-dashboard" />,
  <Route path="/nurse/assigned" element={<AssignedPatients />} key="nurse-assigned" />
];