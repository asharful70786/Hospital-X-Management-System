import React from "react";
import { Route } from "react-router-dom";
import Adminlogs from "../pages/superadmin/ActivityLogs";
import ForgetPass from "../pages/auth/ForgetPass";

export const userRoutes = [
  <Route path="/user/logs" element={<Adminlogs />} key="logs" />,
  <Route path="/users/all" element={<ForgetPass />} key="all" />,
  <Route path="/user/by-role/:role" element={<ForgetPass />} key="role" />,
  <Route path="/user/by-department/:id" element={<ForgetPass />} key="dept" />,
  <Route path="/user/update/:id" element={<ForgetPass />} key="update" />,
  <Route path="/user/deactivate/:id" element={<ForgetPass />} key="deactivate" />
];
