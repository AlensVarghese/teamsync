const express = require('express');
const multer = require('multer');
const Project = require('../models/Project');
const File = require('../models/File');
const User = require('../models/userModel');
const Comment = require('../models/Comment');
const nodemailer = require('nodemailer');
const router = express.Router();
const fs = require('fs')

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other services like SendGrid, Mailgun, etc.
  auth: {
    user: 'goravjindal86@gmail.com',
    pass: 'kggsuzesmoewxvhl'
  }
});

// Function to send email notifications
async function sendEmailNotifications(project, subject, text) {
  const members = await User.find({ _id: { $in: project.members } });
  const admin = await User.findById(project.admin);

  const emails = members.map(member => member.email).concat(admin.email);

  const mailOptions = {
    from: 'goravjindal86@gmail.com',
    to: emails.join(', '),
    subject: subject,
    text: text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Email sent: ' + info.response);
  });
}

// Create a new project
router.post('/', async (req, res) => {
  const { title, description, progress, adminEmail, members } = req.body;

  if (!title || !description || !adminEmail || !Array.isArray(members)) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      return res.status(404).json({ message: 'Admin user not found' });
    }

    const memberList = await User.find({ email: { $in: members.map((m) => m.email) } });

    const newProject = new Project({
      title,
      description,
      progress,
      admin: admin._id,
      members: [...memberList.map((user) => user._id)],
    });

    await newProject.save();

    const populatedProject = await Project.findById(newProject._id)
      .populate('admin')
      .populate('members')
      .exec();

    // Send email notification
    sendEmailNotifications(populatedProject, 'New Project Created', `A new project "${title}" has been created.`);

    res.status(201).json(populatedProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('admin')
      .populate('members')
      .populate('tasks')
      .populate('files');
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Update a project
router.put("/:projectId", async (req, res) => {
  const { projectId } = req.params;
  const updatedData = req.body;

  try {
    const project = await Project.findByIdAndUpdate(projectId, updatedData, {
      new: true,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const populatedProject = await Project.findById(project._id)
      .populate('admin')
      .populate('members')
      .populate('tasks')
      .populate('files')
      .exec();

    // Send email notification
    sendEmailNotifications(populatedProject, 'Project Updated', `The project "${project.title}" has been updated.`);

    res.status(200).json({ message: "Project updated successfully", project: populatedProject });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

// Get a project by ID
router.get('/:projectId', async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId)
      .populate('admin')
      .populate('members')
      .populate('tasks')
      .populate('files');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ project });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Delete a project by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Send email notification
    sendEmailNotifications(deletedProject, 'Project Deleted', `The project "${deletedProject.title}" has been deleted.`);

    res.status(200).json({ message: `Project deleted successfully` });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

// Toggle archive status of a project by ID
router.patch("/:id/archive", async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Toggle the archived status
    project.archived = !project.archived;
    await project.save();

    // Send email notification based on new status
    if (project.archived) {
      sendEmailNotifications(project, 'Project Archived', `The project "${project.title}" has been archived.`);
    } else {
      sendEmailNotifications(project, 'Project Unarchived', `The project "${project.title}" has been unarchived.`);
    }

    res.status(200).json({ message: `Project ${project.archived ? 'archived' : 'unarchived'} successfully`, project });
  } catch (error) {
    console.error("Error toggling archive status:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});


// Upload a file
router.post('/:projectId/files', upload.single('file'), async (req, res) => {
  const { projectId } = req.params;
  const { title } = req.body;
  const file = req.file;

  if (!title || !file) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const newFile = new File({
      title,
      fileName: file.filename,
      fileUrl: `/uploads/${file.filename}`,
      project: project._id
    });

    await newFile.save();

    project.files.push(newFile._id);
    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate('admin')
      .populate('members')
      .populate('tasks')
      .populate('files')
      .exec();

    // Send email notification
    sendEmailNotifications(populatedProject, 'File Uploaded', `A new file "${title}" has been uploaded to the project "${project.title}".`);

    res.status(201).json({ message: 'File uploaded successfully', project: populatedProject });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
});

// View a file
router.get('/files/:fileId', async (req, res) => {
  const { fileId } = req.params;

  try {
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.status(200).json(file);
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Download a file
router.get('/files/:fileId/download', async (req, res) => {
  const { fileId } = req.params;

  try {
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.download(`../client/public/uploads/${file.fileName}`, file.fileName, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).json({ message: 'Server Error', error: err });
      }
    });
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
});

router.post('/:projectId/comments', async (req, res) => {
  const { projectId } = req.params;
  const { message, userEmail } = req.body;

  if (!message || !userEmail) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newComment = new Comment({
      message,
      user: user._id,
      project: project._id,
    });

    await newComment.save();

    project.comments.push(newComment._id);
    await project.save();

    const populatedComment = await Comment.findById(newComment._id)
      .populate('user')
      .exec();

    // Send email notification
    sendEmailNotifications(project, 'New Comment Added', `A new comment has been added to the project "${project.title}".`);

    res.status(201).json({ message: 'Comment added successfully', comment: populatedComment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
});

router.get('/:projectId/comments', async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId).populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: 'email',
      },
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ comments: project.comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
});
router.put('/:projectId/comments/:commentId', async (req, res) => {
  const { projectId, commentId } = req.params;
  const { message } = req.body;

  try {
    // Find the comment by ID and update its message
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { message },
      { new: true }
    ).populate('user');

    if (!updatedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.status(200).json({ message: 'Comment updated successfully', comment: updatedComment });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Delete a comment
router.delete('/:projectId/comments/:commentId', async (req, res) => {
  const { projectId, commentId } = req.params;

  try {
    // Find the comment by ID and delete it
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Remove the comment ID from the project's comments array
    await Project.findByIdAndUpdate(projectId, {
      $pull: { comments: commentId }
    });

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
});
// Delete a file
router.delete('/files/:fileId', async (req, res) => {
  const { fileId } = req.params;

  try {
    // Find the file by ID and delete it
    const deletedFile = await File.findByIdAndDelete(fileId);

    if (!deletedFile) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Remove the file from the project's files array
    await Project.findByIdAndUpdate(deletedFile.project, {
      $pull: { files: fileId }
    });

    // Optionally, delete the file from the filesystem
    const filePath = `../client/public/uploads/${deletedFile.fileName}`;
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file from filesystem:', err);
      }
    });

    // Send email notification
    const project = await Project.findById(deletedFile.project)
      .populate('admin')
      .populate('members')
      .exec();
    sendEmailNotifications(project, 'File Deleted', `A file "${deletedFile.title}" has been deleted from the project "${project.title}".`);

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
});


module.exports = router;
