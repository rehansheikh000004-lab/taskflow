// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: "https://taskflow-gamma-eight.vercel.app", // your Vercel frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model("User", userSchema);

// ✅ ROUTES
app.get("/", (req, res) => {
  res.send("✅ TaskFlow backend running successfully!");
});

app.post("/api/auth/signup", async (req, res) => {
  const { username, password } = req.body;
  const existing = await User.findOne({ username });
  if (existing) return res.status(400).json({ message: "User already exists" });
  await new User({ username, password }).save();
  res.json({ message: "Signup successful" });
});

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });
  res.json({ message: "Login successful", userId: user._id });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
