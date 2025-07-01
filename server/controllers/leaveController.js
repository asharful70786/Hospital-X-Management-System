// src/controllers/leaveController.js
import DoctorLeave from "../Models/DoctorLeave.js";

export const applyDoctorLeave = async (req, res) => {
  try {
    const { doctor, date, reason } = req.body;
    if (!doctor || !date || !reason) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingLeave = await DoctorLeave.findOne({ doctor, date });
    if (existingLeave) {
      return res.status(400).json({ message: "Leave already exists for this date" });
    }

    const leave = new DoctorLeave({ doctor, date, reason, status: "Pending" });
    await leave.save();
    res.status(201).json({ message: "Leave applied successfully", leave });
  } catch (error) {
    res.status(500).json({ message: "Failed to apply leave", error: error.message });
  }
};

export const getDoctorLeaves = async (req, res) => {
  try {
    const leaves = await DoctorLeave.find({ doctor: req.params.id }).sort({ date: 1 });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leaves", error: error.message });
  }
};


// controllers/leaveController.js
export const getLeavesByDate = async (req, res) => {
  try {
    const dateISO = req.query.date;
    if (!dateISO) return res.status(400).json({ message: "date query is required" });

    const docs = await DoctorLeave.find({ date: dateISO, status: "Approved" })
      .select("doctor -_id");

    res.json(docs.map(d => d.doctor.toString()));
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch leave list", error: err.message });
  }
};
