import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: [3, "Name must be at least 3 characters long"]
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"]
  },
  phone: String,
  password: {
    type: String,
    required: true,
    min: [4, "Password must be at least 8 characters long"]
  },
  role: {
    type: String,
    enum: [
      "SuperAdmin",
      "Admin",
      "Doctor",
      "Nurse",
      "Receptionist",
      "Pharmacist",
      "LabTech",
      "Patient"
    ],
    default: "Patient"
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
  }, // for Doctor/Nurse
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  avatarUrl: {
    type: String,
    default : "https://tse4.mm.bing.net/th?id=OIP.9pp6a4bEI0uXZZxPD0rk0wAAAA&pid=Api&P=0&h=180"
  },
});

const User = mongoose.model("User", userSchema);

export default User;