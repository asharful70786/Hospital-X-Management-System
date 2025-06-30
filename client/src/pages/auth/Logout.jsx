import { useContext , useState } from "react";
import { AuthContext } from "../../context/AuthContext";



function Logout() {
  const { Logout } = useContext(AuthContext);

  return (
    <div>
      <button onClick={Logout}>Logout</button>
    </div>
  )
}

export default Logout;