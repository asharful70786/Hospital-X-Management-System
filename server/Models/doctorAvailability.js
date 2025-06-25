import mongoose from "mongoose";
const DoctorAvailabilitySchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dayOfWeek: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  startTime: {
    type: String
  }, // e.g., "09:00"
  endTime: {
    type: String
  },   // e.g., "13:00"
  slotDuration: {
    type: Number, default: 15
  }, // in minutes
});


const DoctorAvailability = mongoose.model('DoctorAvailability', DoctorAvailabilitySchema);
export default DoctorAvailability;