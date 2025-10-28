import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date },
  priority: { type: String, enum: ["Low","Medium","High"], default: "Low" },
  notes: { type: String, default: "" }
}, { timestamps: true });

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);
export default Task;
