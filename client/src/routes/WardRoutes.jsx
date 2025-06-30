import { Route } from "react-router-dom";
import WardDashboard from "../pages/ward/WardDashboard";
import BedManagement from "../pages/ward/BedManagement";

export const wardRoutes = [
  <Route path="/ward/dashboard" element={<WardDashboard />} key="ward-dashboard" />,
  <Route path="/ward/beds" element={<BedManagement />} key="ward-beds" />
];