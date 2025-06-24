import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", required: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
  },
  role: {
    type: String,
    enum: ["Doctor", "Nurse", "Receptionist", "LabTech", "Pharmacist", "Admin"],
    required: true
  },
  joinedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  notes: String
});

const Staff = mongoose.model("Staff", staffSchema);
export default Staff;
