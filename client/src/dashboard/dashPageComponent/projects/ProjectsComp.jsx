import React, { useState, useEffect } from "react";
import Button from "../../../components/Button";
import ProjectCardComp from "./ProjectCardComp"; // Updated import
import { useProjects } from "../../../utils/ProjectsContext";
import axios from "axios";
import MultiSelectDropdown from "../../../components/MultiSelectDropdown";

import { useUser } from "../../../utils/UserContext";

// Helper function to derive a username from an email.
const getUsernameFromEmail = (email) => (email ? email.split("@")[0] : "");

const ProjectsComp = () => {
  const { projects, setProjects, updateProject } = useProjects();
  const { user } = useUser(); // Add this line here

  // Get the user's email from localStorage
  const currentUserEmail = localStorage.getItem("userEmail");

  // Modal state and form fields for adding a new project
  const [openAddProjectModal, setOpenAddProjectModal] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [newProjectProgress, setNewProjectProgress] = useState(0);
  const [newProjectMembers, setNewProjectMembers] = useState([]);
  const [users, setUsers] = useState([]); // Define users state
  const [availableMembers, setAvailableMembers] = useState([]);

  // Fetch all users from the server to use as available members
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/users");
        // Filter out the admin user
        const filteredUsers = response.data.filter(
          (user) => user.email !== "teamsyncadmin@gmail.com"
        );
        setUsers(filteredUsers);
        setAvailableMembers(filteredUsers); // Set available members
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Define the open and close modal functions
  const openAddProject = () => setOpenAddProjectModal(true);
  const closeAddProject = () => {
    setOpenAddProjectModal(false);
    setNewProjectTitle("");
    setNewProjectDescription("");
    setNewProjectProgress(0);
    setNewProjectMembers([]);
  };

  // Handle form submission for adding a new project
  const handleAddProjectSubmit = async (e) => {
    e.preventDefault();

    // 1. Retrieve the token from localStorage
    const token = localStorage.getItem("token");

    // Prepare the new project data with the current user's email as admin
    const newProject = {
      title: newProjectTitle,
      description: newProjectDescription,
      progress: Number(newProjectProgress),
      adminEmail: currentUserEmail,
      members: [{ email: currentUserEmail }, ...newProjectMembers],
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/projects/",
        newProject,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Add the new project at the beginning of the list
      setProjects([response.data, ...projects]);
      // Close the modal
      closeAddProject();
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  // Toggle member selection for the new project
  const handleToggleMember = (member) => {
    setNewProjectMembers((prev) => {
      if (prev.find((m) => m.email === member.email)) {
        return prev.filter((m) => m.email !== member.email);
      } else {
        return [...prev, member];
      }
    });
  };

  // Filter state & actions
  const [filter, setFilter] = useState("All");
  const filters = [
    { name: "All", action: () => setFilter("All") },
    { name: "Assigned", action: () => setFilter("Assigned") },
    { name: "Created", action: () => setFilter("Created") },
    { name: "Archived", action: () => setFilter("Archived") },
  ];

  let filteredProjects = projects;
  if (filter === "Archived") {
    filteredProjects = projects.filter((project) => project.archived);
  } else if (filter === "Created") {
    filteredProjects = projects.filter(
      (project) => !project.archived && project.admin.email === currentUserEmail
    );
  } else if (filter === "Assigned") {
    filteredProjects = projects.filter(
      (project) =>
        !project.archived &&
        project.members.some((member) => member.email === currentUserEmail) &&
        project.admin.email !== currentUserEmail
    );
  } else {
    filteredProjects = projects.filter(
      (project) =>
        !project.archived &&
        project.members.some((member) => member.email === currentUserEmail)
    );
  }

  return (
    <div>
      {/* Filters and Add Project Button */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4">
          {filters.map((f, index) => (
            <Button
              key={index}
              onClick={f.action}
              isActive={filter === f.name}
              className="py-1 text-sm"
            >
              {f.name}
            </Button>
          ))}
        </div>
        {user?.role === 'Admin' && (
        <Button onClick={openAddProject} className="py-1 text-sm !bg-customBgBlue hover:!bg-customHeadingColor text-white">
          + Add Project
        </Button>
        )}
      </div>
      <p className="mt-4 text-sm text-customBlack">Current Filter: {filter}</p>

      {/* Projects Grid using ProjectCardComp */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
        {filteredProjects.map((project) => (
          <ProjectCardComp key={project._id} project={project} />
        ))}
      </div>

      {/* Add Project Modal */}
      {openAddProjectModal && (
        <div className="fixed inset-0 flex items-center justify-center z-20 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-6 w-[40%] relative">
            <button
              onClick={closeAddProject}
              className="absolute top-2 right-2 bg-white text-gray-600 text-2xl border-none hover:border-none focus:outline-none"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4">Add New Project</h3>
            <form onSubmit={handleAddProjectSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  placeholder="Project Title"
                  className="w-full p-2 border bg-white text-black border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder="Project Description"
                  className="w-full p-2 border bg-white text-black border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Progress (%)
                </label>
                <input
                  type="number"
                  value={newProjectProgress}
                  onChange={(e) => setNewProjectProgress(e.target.value)}
                  min="0"
                  max="100"
                  className="w-full p-2 bg-white text-black border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Assign Members / Assignees
                </label>
                <MultiSelectDropdown
                  options={availableMembers}
                  selectedOptions={newProjectMembers}
                  onChange={setNewProjectMembers}
                  placeholder="Select members..."
                />
              </div>
              <Button type="submit" className="py-1 text-sm !bg-customBgBlue hover:!bg-customHeadingColor text-white">
                Add Project
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsComp;
