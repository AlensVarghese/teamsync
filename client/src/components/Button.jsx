import React from "react";

const Button = ({ onClick, children, className = "", isActive = false }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-customButtonLightBg text-customBlack shadow text-base px-5 py-2 rounded-2xl transition hover:bg-customHeadingColor hover:text-white focus:outline-none ${
        isActive ? "bg-customHeadingColor text-white" : "border border-transparent"
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
