import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      name: String,
      type: { type: String, enum: ["Appointment", "Test", "Medicine"] },
      amount: Number
    }
  ],
  totalAmount: Number,
  paymentMode: { type: String, enum: ["Cash", "Card", "UPI", "Insurance"] },
  isPaid: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});


const Bill = mongoose.model("Bill", billSchema);
export default Bill;