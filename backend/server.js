import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
app.use(express.json());

// Setup CORS using ALLOWED_ORIGINS env (comma separated)
const rawOrigins = process.env.ALLOWED_ORIGINS || "";
const allowedOrigins = rawOrigins.split(",").map(s => s.trim()).filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin like curl, mobile, or server-to-server
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0) return callback(null, true); // allow all if not set
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS policy: origin not allowed"), false);
  },
  credentials: true
}));

// Routes
app.use("/api/auth", authRoutes);

// root (useful to confirm service is up)
app.get("/", (req, res) => res.send("✅ TaskFlow backend is running"));

// Connect DB then start server
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.error("❌ MONGO_URI not set. Set it in environment variables.");
  process.exit(1);
}

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
