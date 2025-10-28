import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI not defined");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected");
};

export default connectDB;
