import React, { useState, useEffect } from "react";
import Button from "../../../components/Button";
import MultiSelectDropdown from "../../../components/MultiSelectDropdown";

const GlobalAddTaskForm = ({ projects, addTask, closeForm }) => {
  const [projectId, setProjectId] = useState("");
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [selectedAssignees, setSelectedAssignees] = useState([]);

  // Find the selected project based on projectId
  const selectedProject = projects.find((p) => p._id === projectId);

  // Available assignees are members of the selected project
  const availableAssignees = selectedProject ? selectedProject.members : [];

  // Set default projectId if projects are available
  useEffect(() => {
    if (projects.length > 0 && !projectId) {
      setProjectId(projects[0]._id);
    }
  }, [projects, projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProject) {
      console.error("Selected project is not valid");
      alert("Please select a valid project.");
      return;
    }

    const newTask = {
      taskName,
      description,
      deadline,
      completed: false, // Default completed state
      assignees: selectedAssignees,
      projectId: selectedProject._id,
    };

    // Call the addTask function to handle the API call
    try {
      await addTask(newTask);
      closeForm();
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  if (projects.length === 0) {
    return (
      <div className="mt-2 p-4 border rounded bg-white">
        <h3 className="text-lg font-semibold mb-4">Add New Task</h3>
        <p>No projects available. Please create a project first.</p>
        <div className="flex justify-end gap-2 mt-2">
          <Button type="button" onClick={closeForm}>
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 p-4 border rounded bg-white">
      <h3 className="text-lg font-semibold mb-4">Add New Task</h3>
      {/* Project Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Select Project</label>
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="border p-2 w-full rounded bg-white"
          required
        >
          {projects.map((proj) => (
            <option key={proj._id} value={proj._id}>
              {proj.title}
            </option>
          ))}
        </select>
      </div>
      {/* Task Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Task Name</label>
        <input
          type="text"
          placeholder="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="border p-2 w-full rounded bg-white"
          required
        />
      </div>
      {/* Description */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full rounded bg-white"
          required
        ></textarea>
      </div>
      {/* Deadline */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Deadline</label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="border p-2 w-full rounded bg-transparent text-customBlack"
          required
        />
      </div>
      {/* Assignees Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Assign Assignees</label>
        <MultiSelectDropdown
          options={availableAssignees}
          selectedOptions={selectedAssignees}
          onChange={setSelectedAssignees}
          placeholder="Select assignees..."
        />
      </div>
      <div className="flex justify-end gap-2 mt-2">
        <Button type="button" onClick={closeForm} className="!bg-gray-200 hover:!bg-gray-300 hover:border-customBgBlue hover:text-customBlack" >
          Cancel
        </Button>
        <Button type="submit" className="!bg-customBgBlue text-white hover:!bg-customHeadingColor">Add Task</Button>
      </div>
    </form>
  );
};

export default GlobalAddTaskForm;
