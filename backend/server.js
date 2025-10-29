import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["https://taskflow-gamma-eight.vercel.app", "http://localhost:5500"],
    methods: ["GET", "POST"],
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});
const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => res.send("TaskFlow Backend Running 🚀"));

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User already exists" });
  const user = new User({ email, password });
  await user.save();
  res.json({ message: "Signup successful ✅" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });
  res.json({ message: "Login successful ✅" });
});

app.listen(process.env.PORT || 5000, () =>
  console.log(`✅ Server running on port ${process.env.PORT || 5000}`)
);
