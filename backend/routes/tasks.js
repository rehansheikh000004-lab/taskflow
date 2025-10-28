import express from "express";
import jwt from "jsonwebtoken";
import Task from "../models/Task.js";

const router = express.Router();

// middleware to protect routes
const protect = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "No token" });

  const token = header.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Create
router.post("/", protect, async (req, res) => {
  const { title, dueDate, priority, notes } = req.body;
  if (!title) return res.status(400).json({ message: "Title required" });
  const task = await Task.create({ user: req.userId, title, dueDate, priority, notes });
  res.status(201).json(task);
});

// Read (all for user)
router.get("/", protect, async (req, res) => {
  const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json(tasks);
});

// Update
router.put("/:id", protect, async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.userId });
  if (!task) return res.status(404).json({ message: "Not found" });

  const { title, completed, dueDate, priority, notes } = req.body;
  if (title !== undefined) task.title = title;
  if (completed !== undefined) task.completed = completed;
  if (dueDate !== undefined) task.dueDate = dueDate;
  if (priority !== undefined) task.priority = priority;
  if (notes !== undefined) task.notes = notes;

  await task.save();
  res.json(task);
});

// Delete
router.delete("/:id", protect, async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!task) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted" });
});

export default router;
