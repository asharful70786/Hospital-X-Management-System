
import { Route } from "react-router-dom";
import LabTechDashboard from "../pages/LabTech/LabTechDashboard";
import ViewReport from "../pages/LabTech/ViewReport";


export const labReport = [
  <Route path="/lab/dashboard" element={<LabTechDashboard />} key="bed-dashboard" />,
  <Route path="/labtech/reports" element={<ViewReport />} key="bed-reports" />,
  
];
