import "./App.css";
import { Routes } from "react-router-dom";
import { indexRoutes } from "./routes/IndexRoutes";
import SideBarr from "./components/SideBarr";

function App() {
  return (
    <>
      <SideBarr />
      <Routes>
        {indexRoutes}
      </Routes>
    </>
  );
}

export default App;
