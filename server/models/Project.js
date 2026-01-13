const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  progress: { type: Number, default: 0 },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  files: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }], 
  archived: { type: Boolean, default: false },
}, { timestamps: true });

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
