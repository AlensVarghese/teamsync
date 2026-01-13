const Project = require("../models/Project");

// Create a new project
const createProject = async (req, res) => {
  const { title, description, creatorEmail } = req.body;

  try {
    const newProject = new Project({
      title,
      description,
      admin: { email: creatorEmail },
      members: [{ email: creatorEmail }],
      tasks: [],
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Assign project to user
const assignProjectToUser = async (req, res) => {
  const { projectId, userEmail } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project.members.some((m) => m.email === userEmail)) {
      project.members.push({ email: userEmail });
      await project.save();
      res.status(200).json(project);
    } else {
      res.status(400).json({ message: "User is already a member." });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a project (including tasks)
const updateProject = async (req, res) => {
  const { projectId, updatedData } = req.body;

  try {
    const project = await Project.findByIdAndUpdate(projectId, updatedData, {
      new: true,
    });
    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a project
const deleteProject = async (req, res) => {
  const { projectId } = req.params;

  try {
    await Project.findByIdAndDelete(projectId);
    res.status(200).json({ message: "Project deleted successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Archive a project
const archiveProject = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);
    project.archived = true;
    await project.save();
    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createProject,
  assignProjectToUser,
  updateProject,
  deleteProject,
  archiveProject,
  getProjects,
};
