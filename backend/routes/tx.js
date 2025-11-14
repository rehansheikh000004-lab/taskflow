import express from "express";
import Tx from "../models/Tx.js";
import auth from "../middleware/auth.js";
import mongoose from "mongoose";

const router = express.Router();

// Create transaction
router.post("/", auth, async (req, res) => {
  try {
    const { title, type, amount } = req.body;
    if (!title || !type || !amount) return res.status(400).json({ message: "All fields required" });
    if (!["income","expense"].includes(type)) return res.status(400).json({ message: "Invalid type" });
    const tx = await Tx.create({ userId: req.userId, title: title.trim(), type, amount: Number(amount) });
    res.status(201).json(tx);
  } catch (err) {
    console.error("Create tx error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// List user's transactions
router.get("/", auth, async (req, res) => {
  try {
    const list = await Tx.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error("List tx error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete transaction
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });
    const deleted = await Tx.findOneAndDelete({ _id: id, userId: req.userId });
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Delete tx error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
