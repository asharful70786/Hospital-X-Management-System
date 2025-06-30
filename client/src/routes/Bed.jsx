// ✅ Bed.jsx
import { Route } from "react-router-dom";
import BedDashboard from "../pages/bed/BedDashboard";
import BedReports from "../pages/bed/BedReports";

export const bedRoutes = [
  <Route path="/bed/dashboard" element={<BedDashboard />} key="bed-dashboard" />,
  <Route path="/bed/reports" element={<BedReports />} key="bed-reports" />
];
