import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();
app.use(express.json());

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// DB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB Error:", err));

// User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String
});
const User = mongoose.model("User", UserSchema);

// Task Schema
const TaskSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
  userId: String
});
const Task = mongoose.model("Task", TaskSchema);

// SIGNUP
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password)
      return res.json({ message: "All fields are required" });

    const exists = await User.findOne({ username });

    if (exists)
      return res.json({ message: "User exists" });

    const hashed = await bcrypt.hash(password, 10);

    await User.create({ username, password: hashed });
    res.json({ message: "Signup success" });

  } catch (e) {
    res.json({ message: "Server error" });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.json({ message: "Invalid user" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ message: "Login success", token });

  } catch {
    res.json({ message: "Server error" });
  }
});

// ADD TASK
app.post("/add-task", async (req, res) => {
  const { token, text } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await Task.create({
      text,
      completed: false,
      userId: decoded.id
    });

    res.json({ message: "Task added" });

  } catch {
    res.json({ message: "Invalid token" });
  }
});

// GET TASKS
app.post("/tasks", async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tasks = await Task.find({ userId: decoded.id });

    res.json({ tasks });

  } catch {
    res.json({ message: "Invalid token" });
  }
});

// COMPLETE TASK
app.post("/complete", async (req, res) => {
  const { token, taskId } = req.body;

  try {
    jwt.verify(token, process.env.JWT_SECRET);

    await Task.findByIdAndUpdate(taskId, { completed: true });

    res.json({ message: "Task completed" });

  } catch {
    res.json({ message: "Invalid token" });
  }
});

// DELETE TASK
app.post("/delete", async (req, res) => {
  const { token, taskId } = req.body;

  try {
    jwt.verify(token, process.env.JWT_SECRET);

    await Task.findByIdAndDelete(taskId);

    res.json({ message: "Task deleted" });

  } catch {
    res.json({ message: "Invalid token" });
  }
});

app.listen(5000, () => console.log("Server running on 5000"));
