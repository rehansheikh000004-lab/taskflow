import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";

dotenv.config();

const app = express();
app.use(express.json());

// Setup CORS from ALLOWED_ORIGINS env (comma separated)
const raw = process.env.ALLOWED_ORIGINS || "";
const allowed = raw.split(",").map(s => s.trim()).filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // allow non-browser tools
    if (allowed.length === 0) return cb(null, true);
    if (allowed.includes(origin)) return cb(null, true);
    cb(new Error("CORS not allowed"));
  },
  credentials: true
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// root
app.get("/", (req, res) => res.send("✅ TaskFlow backend running"));

// MongoDB connect then start
const PORT = process.env.PORT || 5000;
if (!process.env.MONGO_URL) {
  console.error("❌ MONGO_URL missing in env");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
