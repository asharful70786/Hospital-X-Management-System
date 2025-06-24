import mongoose from "mongoose";


const prescriptionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", required: true
  },
  medicines: [
    {
      name: String,
      dosage: String,
      frequency: String,
      duration: String
    }
  ],
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

const Prescription = mongoose.model("Prescription", prescriptionSchema);
export default Prescription;