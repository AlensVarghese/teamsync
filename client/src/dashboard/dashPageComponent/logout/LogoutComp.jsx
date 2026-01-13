import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../utils/UserContext";
import Button from "../../../components/Button";

const LogoutComp = ({ open, handleClose }) => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleLogout = () => {
    // Perform logout actions
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setUser(null);
    navigate("/login");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-gray-900 opacity-50" 
        onClick={handleClose}
      ></div>
      {/* Modal */}
      <div className="bg-white rounded-lg shadow-lg p-6 z-10 w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
        <p className="text-gray-700 mb-6">
          Are you sure you want to logout?
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-2xl bg-gray-200 hover:bg-gray-300 transition-colors focus:outline-none"
          >
            Cancel
          </button>
          <Button
            onClick={handleLogout} className="!bg-customBgBlue text-white hover:!bg-customHeadingColor"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LogoutComp;
