import { Route } from "react-router-dom";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsers from "../pages/admin/ManageUsers";

export const adminRoutes = [
  <Route path="/admin/dashboard" element={<AdminDashboard />} key="admin-dashboard" />,
  <Route path="/admin/users" element={<ManageUsers />} key="manage-users" />
];
