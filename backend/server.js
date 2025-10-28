import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: ["https://taskflow-gamma-eight.vercel.app"], credentials: true }));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("MongoDB error:", err));

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("✅ TaskFlow Backend Running!"));
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
