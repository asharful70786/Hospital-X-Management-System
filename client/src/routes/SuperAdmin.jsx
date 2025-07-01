import { Route } from "react-router-dom";
import SuperAdminDashboard from "../pages/superAdmin/SuperAdminDashboard";
import RoleControl from "../pages/superAdmin/RoleControl";
import DepartmentManagement from "../pages/superAdmin/DepartmentManagement";
import BillingSummary from "../pages/superAdmin/BillingSummary";
import PaymentModeStats from "../pages/superAdmin/PaymentModeStats";
import MonthlyTrend from "../pages/superAdmin/MonthlyTrend";
import LabReportManagement from "../pages/superAdmin/LabReportManagement";
import PrescriptionsControl from "../pages/superAdmin/PrescriptionsControl";
import BedManagement from "../pages/superAdmin/BedManagement";
import LogsViewer from "../pages/superAdmin/LogView";


export const superAdminRoutes = [
  <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} key="sa-dashboard" />,
  <Route path="/superadmin/roles" element={<RoleControl />} key="sa-roles" />,
  <Route path="/superadmin/departments" element={<DepartmentManagement />} key="sa-departments" />,
  <Route path="/superadmin/bills/summary" element={<BillingSummary />} key="sa-bills-summary" />,
  <Route path="/superadmin/bills/payment-modes" element={<PaymentModeStats />} key="sa-payment-stats" />,
  <Route path="/superadmin/bills/trend" element={<MonthlyTrend />} key="sa-monthly-trend" />,
  <Route path="/superadmin/records" element={<LabReportManagement />} key="sa-records" />,
  <Route path="/superadmin/prescriptions" element={<PrescriptionsControl />} key="sa-prescriptions" />,
  <Route path="/superadmin/beds" element={<BedManagement />} key="sa-bed-mgmt" />,
  <Route path="/activity-logs" element={<LogsViewer />} key="sa-activity-logs" />
];
