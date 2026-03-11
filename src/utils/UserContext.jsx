// Add 'useContext' to the import list at the top
import React, { createContext, useState, useEffect, useContext } from "react"; 
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    const storedRole = localStorage.getItem("userRole");
    const storedUserId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    
    if (storedEmail) {
      setUser({
        _id: storedUserId || null,
        email: storedEmail,
        role: storedRole || "User",
      });
    }

    if (!token) {
      return;
    }

    axios
      .get("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const nextUser = {
          _id: response.data._id,
          email: response.data.email,
          role: response.data.role || "User",
        };

        localStorage.setItem("userId", nextUser._id);
        localStorage.setItem("userEmail", nextUser.email);
        localStorage.setItem("userRole", nextUser.role);
        setUser(nextUser);
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        setUser(null);
      });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// This hook was failing because useContext wasn't imported
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
