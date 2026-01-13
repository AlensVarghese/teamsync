// MultiSelectDropdown.js
import React, { useState, useEffect, useRef } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

// Helper to derive username from email
const getUsernameFromEmail = (email) => (email ? email.split("@")[0] : "");

const MultiSelectDropdown = ({ options, selectedOptions, onChange, placeholder = "Select assignees..." }) => {
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

  const toggleOption = (option) => {
    if (selectedOptions.find((o) => o.email === option.email)) {
      onChange(selectedOptions.filter((o) => o.email !== option.email));
    } else {
      onChange([...selectedOptions, option]);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="border p-2 rounded cursor-pointer flex justify-between items-center text-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          {selectedOptions.length > 0
            ? selectedOptions.map((o) => getUsernameFromEmail(o.email)).join(", ")
            : placeholder}
        </span>
        <span>{isOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
      </div>
      {isOpen && (
        <div className="absolute z-10 bg-white border mt-1 w-full max-h-28 overflow-y-scroll rounded shadow">
          {options.map((option) => (
            <div
              key={option.email}
              className="p-2 hover:bg-gray-200 flex items-center cursor-pointer"
              onClick={() => toggleOption(option)}
            >
              <input
                type="checkbox"
                readOnly
                checked={!!selectedOptions.find((o) => o.email === option.email)}
                className="mr-2"
              />
              {getUsernameFromEmail(option.email)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
