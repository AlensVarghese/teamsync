import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutComp from "../dashPageComponent/logout/LogoutComp";

const LogoutPage = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    // Close the popup and navigate back to the home page
    setOpen(false);
    navigate("/home/projects");
  };

  return <LogoutComp open={open} handleClose={handleClose} />;
};

export default LogoutPage;
