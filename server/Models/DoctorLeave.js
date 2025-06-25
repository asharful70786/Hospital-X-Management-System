// models/doctorLeave.model.js
import mongoose from "mongoose";

const DoctorLeaveSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  reason: {
    type: String,
    default: "Unavailable",
  },
  fullDay: {
    type: Boolean,
    default: true, // if false,  can add fromTime and toTime
  },
  fromTime: String, 
  toTime: String,   
}, { timestamps: true });

const DoctorLeave = mongoose.model("DoctorLeave", DoctorLeaveSchema);
export default DoctorLeave;