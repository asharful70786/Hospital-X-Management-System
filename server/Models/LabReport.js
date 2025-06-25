import mongoose from "mongoose";

const labReportSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  testType: String,
  status: {
    type: String, enum: ["Pending", "InProgress", "Completed"],
    default: "Pending"
  },
  resultUrl: String,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const LabReport = mongoose.model("LabReport", labReportSchema);

export default LabReport;