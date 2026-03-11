import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import UserAvatar from "../../commonComponents/UserAvatar";
import { FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa";

// Helper function to calculate time ago
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1)
    return Math.floor(interval) + " year" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
  interval = seconds / 2592000;
  if (interval > 1)
    return Math.floor(interval) + " month" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
  interval = seconds / 604800;
  if (interval > 1)
    return Math.floor(interval) + " week" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
  interval = seconds / 86400;
  if (interval > 1)
    return Math.floor(interval) + " day" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
  interval = seconds / 3600;
  if (interval > 1)
    return Math.floor(interval) + " hr" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
  interval = seconds / 60;
  if (interval > 1)
    return Math.floor(interval) + " min" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
  return Math.floor(seconds) + " sec" + (seconds > 1 ? "s" : "") + " ago";
};

const CommentItem = ({ comment, currentUser, onCommentUpdated, onCommentDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(comment.message);
  const [showDropdown, setShowDropdown] = useState(false);

  // Create a ref for the dropdown container
  const dropdownRef = useRef(null);

  // Event listener to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(comment._id);
      const response = await axios.put(
        `http://localhost:5000/api/projects/${comment.projectId}/comments/${comment._id}`,
        { message: editedMessage }
      );
      onCommentUpdated(response.data.comment);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update comment", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/projects/${comment.projectId}/comments/${comment._id}`);
      onCommentDeleted(comment._id);
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };

  return (
    <div className="p-2 border-b relative">
      <div className="flex justify-between items-center">
        {/* Left: User info */}
        <div className="flex items-center">
          <UserAvatar email={comment.user.email} size={32} />
          <span className="ml-2 font-semibold">
            {comment.user.userId || comment.user.email.split("@")[0]}
          </span>
        </div>
        {/* Right: Time ago */}
        <div className="text-xs text-gray-500">{timeAgo(comment.createdAt)}</div>
      </div>
      <div className="mt-1">
        {isEditing ? (
          <form onSubmit={handleEditSubmit}>
            <textarea
              className="w-full p-2 bg-white border rounded mb-2"
              value={editedMessage}
              onChange={(e) => setEditedMessage(e.target.value)}
            />
            <div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-2 py-1 rounded mr-2 text-sm focus:outline-1 focus:outline-customBgBlue"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditedMessage(comment.message);
                }}
                className="bg-gray-300 text-black px-2 py-1 rounded text-sm focus:outline-1 focus:outline-customBgBlue"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <p>{comment.message}</p>
        )}
      </div>
      {currentUser.email === comment.user.email && !isEditing && (
        <div className="absolute bottom-2 right-2" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="text-gray-500 hover:text-gray-700 bg-white p-1 focus:outline-1 focus:outline-customBgBlue"
          >
            <FaEllipsisV />
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
              <button
                onClick={() => {
                  setIsEditing(true);
                  setShowDropdown(false);
                }}
                className="flex items-center w-full bg-white px-2 py-1 hover:bg-gray-100 focus:outline-1 focus:outline-customBgBlue"
              >
                <FaEdit className="mr-2" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => {
                  handleDelete();
                  setShowDropdown(false);
                }}
                className="flex items-center bg-white w-full px-2 py-1 hover:bg-gray-100 focus:outline-1 focus:outline-customBgBlue"
              >
                <FaTrash className="mr-2" />
                <span className="bg-white text-black">Delete</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
