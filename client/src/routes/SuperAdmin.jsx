import { Route } from "react-router-dom";
import SuperAdminDashboard from "../pages/superAdmin/SuperAdminDashboard";
import RoleControl from "../pages/superAdmin/RoleControl";

export const superAdminRoutes = [
  <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} key="sa-dashboard" />,
  <Route path="/superadmin/roles" element={<RoleControl />} key="sa-roles" />
];