import mongoose from "mongoose";

const doctorAvailabilitySchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,

  },
  weekday: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    required: true,

  },
  slots: [
    {
      type: String, // e.g., "10:00", "14:30"
      required: true,
    }
  ]
});

doctorAvailabilitySchema.index({ doctor: 1, weekday: 1 }, { unique: true });

const DoctorAvailability = mongoose.model("DoctorAvailability", doctorAvailabilitySchema);
export default DoctorAvailability;

