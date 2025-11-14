import mongoose from "mongoose";

const txSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ["income","expense"], required: true },
  amount: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.models.Tx || mongoose.model("Tx", txSchema);
