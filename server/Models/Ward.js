import mongoose from "mongoose";

const wardSchema = new mongoose.Schema({
  name: String,
  type: {
    type: String,
    enum: ["General", "ICU", "Private"]
  },
  capacity: Number,
  description: String
});

const Ward = mongoose.model("Ward", wardSchema);
export default Ward;
