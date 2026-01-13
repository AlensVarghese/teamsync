const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    taskName: { type: String, required: true },
    description: String,
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    deadline: { type: Date, required: true },
    completed: { type: Boolean, default: false },
    assignees: [{ email: { type: String, required: true } }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
