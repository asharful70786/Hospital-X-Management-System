import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { indexRoutes } from "./routes/IndexRoutes";
import SideBarr from "./components/SideBarr";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import LoadingSpinner from "./components/LoadingSpinner"; // Create this component

function App() {
  return (
    <>
      <SideBarr />
        <ToastContainer
        position="top-right" autoClose={3000} hideProgressBar={false}
        newestOnTop={true} closeOnClick  pauseOnHover
        draggable theme="colored"
      />
      <Routes>
        {indexRoutes}
      </Routes>
    </>
  )
}

export default App;