import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const BaseUrl = "http://localhost:4000";
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(`${BaseUrl}/auth/current-user`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Unauthenticated");
        const data = await response.json();
        setUser(data);
             } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const Login = async ({ email, password }) => {
    try {
      const response = await fetch(`${BaseUrl}/auth/login`, {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Login failed");
      const data = await response.json();
      setUser(data);
      toast.success("Login successful!");
    } catch (err) {
      toast.error("Login failed!");   
      throw err;
        
    }
  };

  const Logout = async () => {
    try {
      const response = await fetch(`${BaseUrl}/auth/logout`, {
        credentials: "include",
        method: "POST",
      });
      if (!response.ok) throw new Error("Logout failed");
      await response.json();
      setUser(null);
      toast.success("Logout successful!");
    } catch (err) {
      toast.error("Logout failed!");
      console.error("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, Login, Logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export {AuthContext}
export default AuthProvider;