
import React, { useState } from "react";
import Button from "../../../components/Button";
import { FaComments, FaShare, FaArchive, FaTrash } from "react-icons/fa";
import TooltipButton from "../../../components/TooltipButton"; // adjust the import path as needed
import UserAvatar from "../commonComponents/UserAvatar";
import axios from "axios";

// Helper function to derive a username from an email.
const getUsernameFromEmail = (email) => (email ? email.split("@")[0] : "");

const ProjectCard = ({ project, isAdmin, updateProject, archiveProject, deleteProject, availableMembers, setProjects }) => {

  // Calculate total tasks and total members
  const totalTasks = project.tasks ? project.tasks.length : 0;
  const totalMembers = project.members ? project.members.length : 0;
  console.log(project);
  // Local state for the Manage modal
  const [openManageModal, setOpenManageModal] = useState(false);
  const [managedTitle, setManagedTitle] = useState(project.title);
  const [managedDescription, setManagedDescription] = useState(project.description);
  const [managedProgress, setManagedProgress] = useState(project.progress);
  const [managedMembers, setManagedMembers] = useState(project.members || []);
  
  // Toggle membership using email as unique identifier
  const toggleManagedMember = (member) => {
    if (managedMembers.find((m) => m.email === member.email)) {
      setManagedMembers(managedMembers.filter((m) => m.email !== member.email));
    } else {
      setManagedMembers([...managedMembers, member]);
    }
  };
  
  const handleManageSubmit = async (e) => {
    e.preventDefault();
  
    const updatedProject = {
      title: managedTitle,
      description: managedDescription,
      progress: Number(managedProgress),
      members: managedMembers.map((m) => m._id), // Only send member IDs
    };
  
    try {
      const response = await axios.put(
        `http://localhost:5000/api/projects/${project._id}`,
        updatedProject
      );
  
      const updatedData = response.data.project;
  
      // Update the project list in the parent component
      setProjects((prevProjects) =>
        prevProjects.map((p) => (p._id === project._id ? updatedData : p))
      );
  
      setOpenManageModal(false);
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };
  
  
  return (
    <div className="w-[320px] m-4 relative">
      {/* Admin-only Archive and Delete icons at the top right */}
      {isAdmin && (
        <div className="absolute -top-5 right-3 flex gap-2">
          <TooltipButton
            tooltip="Archive"
            onClick={() => archiveProject(project._id)}
            className="p-1 bg-customBgBlue rounded-full shadow"
          >
            <FaArchive />
          </TooltipButton>
          <TooltipButton
            tooltip="Delete"
            onClick={() => deleteProject(project._id)}
            className="p-1 bg-customBgBlue rounded-full shadow"
          >
            <FaTrash />
          </TooltipButton>
        </div>
      )}
      <div className="flex flex-col rounded-2xl p-4 bg-customBgLightBlue shadow-md">
        {/* Project Title & Description */}
        <h2 className="text-lg font-semibold mb-2 self-center">
          {project.title}
        </h2>
        <p className="text-sm font-medium text-customBlack mb-1">Description</p>
        <div className="text-xs p-4 text-customBlack bg-customBgLightBlueOpacity border border-gray-300 rounded-xl mb-4">
          {project.description}
        </div>
  
        {/* Project Stats */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-customBlack">
            Total Tasks: <span className="font-bold">{totalTasks}</span>
          </p>
          <p className="text-sm text-customBlack">
            Total Members: <span className="font-bold">{totalMembers}</span>
          </p>
        </div>
  
        {/* Bottom Action Buttons */}
        <div className="flex justify-between items-center">
          <Button
            onClick={() => setOpenManageModal(true)}
            className="py-1 text-sm"
          >
            Manage
          </Button>
          <div className="flex items-center gap-2">
            <TooltipButton
              tooltip="Comments"
              onClick={() => console.log("Comments clicked")}
              className="p-1"
            >
              <FaComments />
            </TooltipButton>
            <TooltipButton
              tooltip="Share Files"
              onClick={() => console.log("Share Files clicked")}
              className="p-1"
            >
              <FaShare />
            </TooltipButton>
          </div>
        </div>
      </div>
  
      {/* Manage Project Modal */}
      {openManageModal && (
        <div className="fixed inset-0 flex items-center justify-center z-20 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-6 w-96 relative">
            <button
              onClick={() => setOpenManageModal(false)}
              className="absolute top-2 right-2 bg-white text-gray-600 text-2xl border-none hover:border-none focus:outline-none"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4">Manage Project</h3>
            <form onSubmit={handleManageSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={managedTitle}
                  onChange={(e) => setManagedTitle(e.target.value)}
                  placeholder="Project Title"
                  className="w-full p-2 border bg-white text-black border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={managedDescription}
                  onChange={(e) => setManagedDescription(e.target.value)}
                  placeholder="Project Description"
                  className="w-full p-2 border bg-white text-black border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Progress (%)</label>
                <input
                  type="number"
                  value={managedProgress}
                  onChange={(e) => setManagedProgress(e.target.value)}
                  min="0"
                  max="100"
                  className="w-full p-2 border bg-white text-black border-gray-300 rounded"
                  required
                />
              </div>
              {/* Assign Members Section */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Assign Members</label>
                <div className="flex flex-wrap gap-2">
                  {availableMembers.map((member) => (
                    <div key={member.email} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`manage-member-${member.email}`}
                        checked={!!managedMembers.find((m) => m.email === member.email)}
                        onChange={() => toggleManagedMember(member)}
                      />
                      <label
                        htmlFor={`manage-member-${member.email}`}
                        className="ml-1 text-sm flex items-center gap-1"
                      >
                        <UserAvatar email={member.email} size={24} />
                        {getUsernameFromEmail(member.email)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <Button type="submit" className="py-1 text-sm">
                Save Changes
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;


