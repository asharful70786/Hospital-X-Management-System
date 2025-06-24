import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", required: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
  },
  date: Date,
  time: String,
  status: {
    type: String, enum: ["Scheduled", "Completed", "Cancelled"],
    default: "Scheduled"
  },
  symptoms: String
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;