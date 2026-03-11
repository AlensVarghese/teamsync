import React from "react";
import Button from "./Button";

const TooltipButton = ({ tooltip, children, className = "", ...props }) => {
  // Override default padding for tooltip usage by forcing lower padding with !important
  const tooltipButtonClasses = `!px-2 !py-1 ${className}`;
  
  return (
    <div className="relative group inline-block">
      <Button {...props} className={tooltipButtonClasses}>
        {children}
      </Button>
      {/* Tooltip text appears on hover */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap">
        {tooltip}
      </div>
    </div>
  );
};

export default TooltipButton;
