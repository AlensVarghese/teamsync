import React, { useState, useEffect } from "react";
import axios from "axios";
import UserAvatar from "../dashPageComponent/commonComponents/UserAvatar";
import ConfirmationModal from "./ConfirmationModal";

// Manage Users Component

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Modal state for deletion and for feedback messages
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    userId: null,
    message: ""
  });
  const [feedbackModal, setFeedbackModal] = useState({
    open: false,
    message: ""
  });

  // Fetch all users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/users");
        // Filter out the admin user
        const filteredUsers = response.data.filter(
          (user) => user.email !== "teamsyncadmin@gmail.com"
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
  
    fetchUsers();
  }, []);
  
  // Delete a user using modal confirmation
  const openDeleteModal = (userId) => {
    setDeleteModal({
      open: true,
      userId,
      message: "Are you sure you want to delete this user?"
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/auth/users/${deleteModal.userId}`);
      setUsers(users.filter((user) => user._id !== deleteModal.userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setDeleteModal({ open: false, userId: null, message: "" });
    }
  };

  // Add a new user using modal feedback instead of alert
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setFeedbackModal({ open: true, message: "Please enter both email and password." });
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", { email, password });
      setUsers([...users, { _id: response.data._id, email }]);
      setEmail("");
      setPassword("");
      setFeedbackModal({ open: true, message: "User added successfully!" });
    } catch (error) {
      console.error("Error adding user:", error);
      setFeedbackModal({ open: true, message: "Failed to add user." });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">User Management</h2>

      {/* Add User Form */}
      <form onSubmit={handleAddUser} className="mb-4 p-4 border border-gray-300 rounded">
        <h3 className="font-semibold mb-2">Add User</h3>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 mr-2 bg-white focus:outline-1 focus:outline-customBgBlue"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mr-2 bg-white focus:outline-1 focus:outline-customBgBlue"
          required
        />
        <button 
          type="submit" 
          className="bg-customBgBlue hover:bg-customHeadingColor transition text-white py-1 px-3 rounded focus:outline-none"
        >
          + Add User
        </button>
      </form>

      {/* Users Table */}
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Avatar</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="border border-gray-300 p-2 flex justify-center items-center">
                <UserAvatar email={user.email} size={40} />
              </td>
              <td className="border border-gray-300 p-2 text-center">{user.email}</td>
              <td className="border border-gray-300 p-2 text-center">
                <button
                  onClick={() => openDeleteModal(user._id)}
                  className="focus:outline-none bg-red-500 text-white py-1 px-3 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal 
        open={deleteModal.open}
        message={deleteModal.message}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ open: false, userId: null, message: "" })}
        confirmButtonText="Delete"
      />

      {/* Feedback Modal for alerts */}
      <ConfirmationModal 
        open={feedbackModal.open}
        message={feedbackModal.message}
        onConfirm={() => setFeedbackModal({ open: false, message: "" })}
        onCancel={() => setFeedbackModal({ open: false, message: "" })}
        confirmButtonText="OK"
      />
    </div>
  );
};


// Manage Projects Component

const ManageProjects = ({ showArchived }) => {
  const [projects, setProjects] = useState([]);
  
  // Modal state for archive and delete actions
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    message: "",
    action: null, // action to call on confirmation
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/projects");
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const openConfirmModal = (message, action) => {
    setConfirmModal({ open: true, message, action });
  };

  const handleArchive = (projectId) => {
    const projectToToggle = projects.find((p) => p._id === projectId);
    if (!projectToToggle) return;
    const actionText = projectToToggle.archived ? "Unarchive" : "Archive";
    openConfirmModal(
      `${actionText} this project?`,
      async () => {
        try {
          await axios.patch(`http://localhost:5000/api/projects/${projectId}/archive`);
          setProjects((prevProjects) =>
            prevProjects.map((project) =>
              project._id === projectId
                ? { ...project, archived: !project.archived }
                : project
            )
          );
        } catch (error) {
          console.error("Error toggling archive for project:", error);
        } finally {
          setConfirmModal({ open: false, message: "", action: null });
        }
      }
    );
  };

  const handleDelete = (projectId) => {
    openConfirmModal(
      "Delete this project? This action cannot be undone.",
      async () => {
        try {
          await axios.delete(`http://localhost:5000/api/projects/${projectId}`);
          setProjects(projects.filter((project) => project._id !== projectId));
        } catch (error) {
          console.error("Error deleting project:", error);
        } finally {
          setConfirmModal({ open: false, message: "", action: null });
        }
      }
    );
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {showArchived ? "Archived Projects" : "Project Management"}
      </h2>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Title</th>
            {/* Instead of Description, show Assignees */}
            <th className="border border-gray-300 p-2">Assignees</th>
            {/* New column for Total Tasks */}
            <th className="border border-gray-300 p-2">Total Tasks</th>
            <th className="border border-gray-300 p-2">Progress</th>
            <th className="border border-gray-300 p-2">Archived</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects
            .filter((project) => project.archived === showArchived)
            .map((project) => (
              <tr key={project._id}>
                <td className="border border-gray-300 p-2 text-center font-semibold text-customBlack">
                  {project.title}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {project.members && project.members.length > 0 ? (
                    <div className="flex justify-center items-center -space-x-2">
                      {project.members.map((member) => (
                        <UserAvatar
                          key={member.email}
                          email={member.email}
                          size={28}
                        />
                      ))}
                    </div>
                  ) : (
                    "No assignees"
                  )}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {project.tasks ? project.tasks.length : 0}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {project.progress}%
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {project.archived ? "Yes" : "No"}
                </td>
                <td className="border border-gray-300 p-2 flex justify-center items-center">
                  <button
                    onClick={() => handleArchive(project._id)}
                    className="focus:outline-none bg-yellow-500 text-white py-1 px-3 rounded mr-2"
                  >
                    {project.archived ? "Unarchive" : "Archive"}
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="focus:outline-none bg-red-500 text-white py-1 px-3 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Confirmation Modal for Archive/Delete */}
      <ConfirmationModal 
        open={confirmModal.open}
        message={confirmModal.message}
        onConfirm={confirmModal.action}
        onCancel={() => setConfirmModal({ open: false, message: "", action: null })}
      />
    </div>
  );
};



// Admin Dashboard Component with Tab Navigation
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("users")}
          className={`btn border-gray-300 bg-gray-200 !text-customBlack shadow focus:outline-none transition ${
            activeTab === "users"
              ? "!bg-customBgBlue !text-customWhite"
              : "hover:bg-customBgBlue hover:!text-customWhite active:bg-customBgBlue active:text-customWhite"
          }`}
        >
          Manage Users
        </button>
        {/* <button
          onClick={() => setActiveTab("deletedUsers")}
          className={`border-gray-300 shadow focus:outline-none transition ${
            activeTab === "deletedUsers"
              ? "bg-customBgBlue text-customWhite"
              : "hover:bg-customBgBlue hover:text-customWhite active:bg-customBgBlue active:text-customWhite"
          }`}
        >
          Deleted Users
        </button> */}
        <button
          onClick={() => setActiveTab("projects")}
          className={`btn border-gray-300 bg-gray-200 !text-customBlack shadow focus:outline-none transition ${
            activeTab === "projects"
              ? "!bg-customBgBlue !text-customWhite"
              : "hover:bg-customBgBlue hover:!text-customWhite active:bg-customBgBlue active:text-customWhite"
          }`}
        >
          Manage Projects
        </button>
        <button
          onClick={() => setActiveTab("archivedProjects")}
          className={`btn border-gray-300 bg-gray-200 !text-customBlack shadow focus:outline-none transition ${
            activeTab === "archivedProjects"
              ? "!bg-customBgBlue !text-customWhite"
              : "hover:bg-customBgBlue hover:!text-customWhite active:bg-customBgBlue active:text-customWhite"
          }`}
        >
          Archived Projects
        </button>
      </div>

      {activeTab === "users" && <ManageUsers showDeleted={false} />}
      {/* {activeTab === "deletedUsers" && <ManageUsers showDeleted={true} />} */}
      {activeTab === "projects" && <ManageProjects showArchived={false} />}
      {activeTab === "archivedProjects" && (
        <ManageProjects showArchived={true} />
      )}
    </div>
  );
};

export default AdminDashboard;
