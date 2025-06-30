import "./App.css";
import { Routes } from "react-router-dom";
import SideBarr from "./components/SideBarr";
import { authRoutes } from "./routes/AuthRoutes";
import { userRoutes } from "./routes/UserRoutes";


function App() {
  return (
    <>
      <SideBarr />
      <Routes>
        
        {authRoutes}
        {userRoutes}
      </Routes>
    </>
  );
}

export default App;
