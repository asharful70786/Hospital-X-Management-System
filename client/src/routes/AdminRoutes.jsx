import { Route } from "react-router-dom";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import RoleControl from "../pages/superAdmin/RoleControl";
import DepartmentManagement from "../pages/superAdmin/DepartmentManagement";
import BillingSummary from "../pages/superAdmin/BillingSummary";
import PaymentModeStats from "../pages/superAdmin/PaymentModeStats";
import MonthlyTrend from "../pages/superAdmin/MonthlyTrend";
import LabReportManagement from "../pages/superAdmin/LabReportManagement";
import PrescriptionsControl from "../pages/superAdmin/PrescriptionsControl";
import BedManagement from "../pages/superAdmin/BedManagement";
import LogsViewer from "../pages/superAdmin/LogView";

export const adminRoutes = [
  <Route path="/admin/dashboard" element={<AdminDashboard />} key="admin-dashboard" />,
  <Route path="/admin/users" element={<ManageUsers />} key="manage-users" />,
  <Route path="/admin/roles" element={<RoleControl />} key="sa-roles" />,
  <Route path="/admin/departments" element={<DepartmentManagement />} key="sa-departments" />,
  <Route path="/admin/bills/summary" element={<BillingSummary />} key="sa-bills-summary" />,
  <Route path="/admin/bills/payment-modes" element={<PaymentModeStats />} key="sa-payment-stats" />,
  <Route path="/admin/bills/trend" element={<MonthlyTrend />} key="sa-monthly-trend" />,
  <Route path="/admin/records" element={<LabReportManagement />} key="sa-records" />,
  <Route path="/admin/prescriptions" element={<PrescriptionsControl />} key="sa-prescriptions" />,
  <Route path="/admin/beds" element={<BedManagement />} key="sa-bed-mgmt" />,
  <Route path="/activity-logs" element={<LogsViewer />} key="sa-activity-logs" />
];





 