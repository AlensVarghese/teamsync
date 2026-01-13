// components/ConfirmationModal.jsx
import React from "react";
import Button from "../../components/Button";

const ConfirmationModal = ({ 
  open, 
  message, 
  onConfirm, 
  onCancel, 
  confirmButtonText = "Confirm", 
  cancelButtonText = "Cancel" 
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-gray-900 opacity-50" 
        onClick={onCancel}
      ></div>
      {/* Modal Content */}
      <div className="bg-white rounded-lg shadow-lg p-6 z-10 w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">Please Confirm</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-2xl bg-gray-200 hover:bg-gray-300 transition-colors focus:outline-none"
          >
            {cancelButtonText}
          </button>
          <Button 
            onClick={onConfirm}
            className="!bg-customBgBlue text-white hover:!bg-customHeadingColor"
          >
            {confirmButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
