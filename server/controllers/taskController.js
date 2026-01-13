const Project = require('../models/Project');
const Task = require('../models/Task');

// Add a new task
exports.addTask = async (req, res) => {
  try {
    const { taskName, description, projectId, deadline, assignees } = req.body;
    const newTask = new Task({
      taskName,
      description,
      projectId,
      deadline,
      assignees,
    });
    await newTask.save();

    await Project.findByIdAndUpdate(projectId, { $push: { tasks: newTask._id } });

    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, { new: true });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const { taskId, projectId } = req.params;
    await Task.findByIdAndDelete(taskId);
    await Project.findByIdAndUpdate(projectId, { $pull: { tasks: taskId } });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get tasks for a user
exports.getUserTasks = async (req, res) => {
  try {
    const { email } = req.query;
    const projects = await Project.find({ 'members.email': email }).populate('tasks');
    const tasks = projects.flatMap(project => project.tasks);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
