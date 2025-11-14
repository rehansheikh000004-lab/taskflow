import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import txRoutes from "./routes/tx.js";

dotenv.config();
const app = express();
app.use(express.json());

// CORS - allow your frontend (add more if needed)
const frontend = process.env.FRONTEND_URL || "";
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // allow non-browser tools
    if (!frontend) return cb(null, true);
    if (frontend === origin) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/tx", txRoutes);

app.get("/", (req, res) => res.json({ ok: true, message: "Budget backend running" }));

const PORT = process.env.PORT || 5000;
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI not set in env");
  process.exit(1);
}
mongoose.connect(process.env.MONGO_URL)
  .then(()=> {
    console.log("✅ MongoDB connected");
    app.listen(PORT, ()=> console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error("Mongo connect error:", err);
    process.exit(1);
  });
