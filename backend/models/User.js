import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

// Avoid "OverwriteModelError" in dev/reloads
export default mongoose.models.User || mongoose.model("User", userSchema);
