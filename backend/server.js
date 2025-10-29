import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
  origin: ["https://taskflow-gamma-eight.vercel.app"],
  methods: ["GET", "POST"],
  credentials: true
}));

// ✅ Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// ✅ User Schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
const User = mongoose.model("User", userSchema);

// ✅ Routes
app.get("/", (req, res) => res.send("TaskFlow backend running 🚀"));

// Signup
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "User already exists" });
  const user = new User({ email, password });
  await user.save();
  res.json({ message: "Signup successful", user });
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });
  res.json({ message: "Login successful", user });
});

app.listen(process.env.PORT || 10000, () =>
  console.log(`✅ Server running on port ${process.env.PORT || 10000}`)
);
