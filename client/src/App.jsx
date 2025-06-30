import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Logout from "./pages/auth/Logout";
import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";  //for styling toast
import SideBarr from "./components/SideBarr";
import ForgetPass from "./pages/auth/ForgetPass";


function App() {
  return (
    <div>
      <SideBarr />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="logout" element={<Logout />} />
        <Route path="forget-password" element={<ForgetPass />} />
      </Routes>

   
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
