import mongoose from "mongoose";

const inventoryItemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  category: String,
  expiryDate: Date,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  notes: String
});

const InventoryItem = mongoose.model("InventoryItem", inventoryItemSchema);
export default InventoryItem;