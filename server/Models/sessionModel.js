import mongoose from "mongoose";

const sessionSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 10 * 60 * 1000 * 24 * 7), // 7 days
  },
})

const Session = mongoose.model("Session", sessionSchema);
export default Session;