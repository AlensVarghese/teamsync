// AssigneesDropdown.js
import React, { useState, useEffect, useRef } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const AssigneesDropdown = ({
  assignees = [],
  variant = "task",          // "task" or "project"
  dropdownWidth = "w-48",     // Tailwind width class for the dropdown container
  renderItem,                // optional custom render function
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Default render function for each assignee
  const defaultRenderItem = (assignee) => {
    if (variant === "task") {
      return (
        <div className="flex justify-between items-center overflow-x-scroll p-2 border-b last:border-b-0">
          <img
            src={assignee.avatar}
            alt={assignee.name}
            className="w-8 h-8 rounded-full mr-2"
          />
          <span className="text-sm">{assignee.name}</span>
        </div>
      );
    } else if (variant === "project") {
      return (
        <div className="flex justify-between items-center overflow-x-scroll p-2 border-b last:border-b-0">
          <img
            src={assignee.avatar}
            alt={assignee.name}
            className="w-10 h-10 rounded-full mr-2"
          />
          <div>
            <span className="text-sm font-medium">{assignee.name}</span>
            {/* If extra info (e.g. tasks count) is provided, show it */}
            {assignee.taskCount !== undefined && (
              <span className="block text-xs text-gray-500">
                {assignee.taskCount} tasks
              </span>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-1 focus:outline-none text-sm text-blue-600"
      >
        <span>View Members</span>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>
      {isOpen && (
        <div
          className={`absolute top-full left-0 mt-1 bg-white border rounded shadow max-h-40 overflow-y-scroll z-20 ${dropdownWidth}`}
        >
          {assignees.map((assignee) => (
            <div key={assignee.id}>
              {renderItem ? renderItem(assignee) : defaultRenderItem(assignee)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssigneesDropdown;
