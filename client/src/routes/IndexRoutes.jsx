import { authRoutes } from "./AuthRoutes";
import { adminRoutes } from "./AdminRoutes";
import { superAdminRoutes } from "./SuperAdmin.jsx";
import { userRoutes } from "./UserRoutes";
import { doctorRoutes } from "./Doctor.jsx";
import { nurseRoutes } from "./Nurse.jsx";
import { wardRoutes } from "./WardRoutes.jsx";
import { receptionRoutes } from "./Receptionist.jsx";
import {patientRoutes} from "./PatientRoutes.jsx"
import { bedRoutes } from "./Bed.jsx"; 

export const indexRoutes = [
  ...authRoutes,
  ...adminRoutes,
  ...superAdminRoutes,
  ...userRoutes,
  ...doctorRoutes,
  ...nurseRoutes,
  ...wardRoutes,
  ...receptionRoutes,
  ...patientRoutes,
  ...bedRoutes
];
