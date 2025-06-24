import mongoose from "mongoose";

// models/Medicine.js
const medicineSchema = new mongoose.Schema({
  name: String,
  stock: Number,
  expiryDate: Date,
  batchNumber: String,
  manufacturer: String,
  price: Number
});

const Medicine = mongoose.model("Medicine", medicineSchema);
export default Medicine;
