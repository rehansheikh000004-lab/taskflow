import express from "express";
import Task from "../models/Task.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const router = express.Router();

const auth = (req, res, next) => {
  const header = req.header("Authorization");
  if (!header) return res.status(401).json({ message: "No token" });
  const token = header.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// GET /api/tasks - list user's tasks
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error("Get tasks error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/tasks - create
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    if (!title) return res.status(400).json({ message: "Title required" });
    const task = await Task.create({ userId: req.userId, title: title.trim(), description: description || "", dueDate: dueDate || null });
    res.status(201).json(task);
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/tasks/:id - update
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });
    const updated = await Task.findOneAndUpdate({ _id: id, userId: req.userId }, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Task not found" });
    res.json(updated);
  } catch (err) {
    console.error("Update task error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/tasks/:id - delete
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });
    const deleted = await Task.findOneAndDelete({ _id: id, userId: req.userId });
    if (!deleted) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("Delete task error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
