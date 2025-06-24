//For  accessing a patients complete medical history

import mongoose from "mongoose";

const recordSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  visitDate: {
    type: Date,
    default: Date.now,
  },
  symptoms: String,
  diagnosis: String,
  prescriptions: [
    {
      name: String,
      dosage: String,
      frequency: String,
      duration: String,
    }
  ],
  labReports: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LabReport"
    }
  ],
  notes: String,
});

const PatientRecord = mongoose.model("PatientRecord", recordSchema);
export default PatientRecord;
