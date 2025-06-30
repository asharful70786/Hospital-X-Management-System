import mongoose from "mongoose";

const bedSchema = new mongoose.Schema({
  ward: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ward" 
  },
  number: Number,
  status: {
    type: String,
    enum: ["Available", "Occupied", "Maintenance"],
    default: "Available"
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  assignedAt: Date
});

const Bed = mongoose.model("Bed", bedSchema);
export default Bed;
