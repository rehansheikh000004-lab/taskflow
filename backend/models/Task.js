import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  dueDate: { type: Date },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model("Task", taskSchema);
