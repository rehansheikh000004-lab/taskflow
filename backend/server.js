import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";

dotenv.config();
const app = express();

// JSON + CORS
app.use(express.json());
app.use(cors({
  origin: "*" // change to your frontend URL(s) for production
}));

// connect to DB then start
connectDB()
  .then(() => {
    app.use("/api/auth", authRoutes);
    app.use("/api/tasks", taskRoutes);
    app.get("/", (req, res) => res.send("TaskFlow backend running"));

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error("DB connection failed:", err);
    process.exit(1);
  });
