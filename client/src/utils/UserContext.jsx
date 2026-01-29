// Add 'useContext' to the import list at the top
import React, { createContext, useState, useEffect, useContext } from "react"; 

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    // It's a good idea to store the role in localStorage during login
    const storedRole = localStorage.getItem("userRole"); 
    
    if (storedEmail) {
      setUser({ email: storedEmail, role: storedRole || "User" });
    }
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