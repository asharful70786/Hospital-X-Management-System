import { Route } from "react-router-dom";
import Profile from "../pages/user/Profile";
import Settings from "../pages/user/Settings";

export const userRoutes = [
  <Route path="/user/profile" element={<Profile />} key="user-profile" />,
  <Route path="/user/settings" element={<Settings />} key="user-settings" />
];
