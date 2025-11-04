import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
  origin: "https://taskflow-gamma-eight.vercel.app", // your Vercel frontend
  methods: ["GET", "POST"],
  credentials: true
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});
const User = mongoose.model("User", userSchema);

// --- Signup ---
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });
  if (existingUser) return res.json({ success: false, message: "User already exists" });

  const user = new User({ username, password });
  await user.save();
  res.json({ success: true, message: "Signup successful" });
});

// --- Login ---
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (!user) return res.json({ success: false, message: "Invalid credentials" });

  res.json({ success: true, message: "Login successful" });
});

app.get("/", (req, res) => {
  res.send("✅ Backend is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
