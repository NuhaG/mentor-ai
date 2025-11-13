import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "ai"], required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const SessionSchema = new mongoose.Schema({
  personaId: String,
  personaName: String,
  conversation: [MessageSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Session || mongoose.model("Session", SessionSchema);
