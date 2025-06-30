import React from "react";
import { Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Logout from "../pages/auth/Logout";
import ForgetPass from "../pages/auth/ForgetPass";


export const authRoutes = [
  <Route path="/login" element={<Login />} key="login" />,
  <Route path="/register" element={<Register />} key="register" />,
  <Route path="/logout" element={<Logout />} key="logout" />,
  <Route path="/forget-password" element={<ForgetPass />} key="forget-password" />
];
