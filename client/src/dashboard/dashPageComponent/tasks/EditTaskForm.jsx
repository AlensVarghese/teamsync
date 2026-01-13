// EditTaskForm.js
import React, { useState } from "react";
import Button from "../../../components/Button";
import MultiSelectDropdown from "../../../components/MultiSelectDropdown";

const EditTaskForm = ({ projectId, task, updateTask, closeForm, availableAssignees }) => {
  const [taskName, setTaskName] = useState(task.taskName);
  const [description, setDescription] = useState(task.description);
  const [deadline, setDeadline] = useState(
    task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : ""
  );  
  const [selectedAssignees, setSelectedAssignees] = useState(task.assignees || []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedTask = {
      ...task,
      taskName,
      description,
      deadline,
      assignees: selectedAssignees,
      projectId, // ensures task still references its project
    };
    updateTask(updatedTask);
    closeForm();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 p-4 border rounded">
      <h3 className="text-lg font-semibold mb-4">Edit Task</h3>
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
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Deadline</label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="border p-2 w-full rounded bg-white text-customBlack"
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
      <div className="flex justify-end gap-2">
        <Button type="button" onClick={closeForm} className="!bg-gray-200 hover:!bg-gray-300 hover:!border-customBgBlue hover:!text-customBlack">
          Cancel
        </Button>
        <Button type="submit" className="text-white !bg-customBgBlue hover:!bg-customHeadingColor">Save Changes</Button>
      </div>
    </form>
  );
};

export default EditTaskForm;
