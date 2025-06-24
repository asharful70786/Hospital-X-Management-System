import express from "express";
import checkAuth from "../middleWare/checkAuthMiddleWare.js";
import PatientRecord from "../Models/PatientRecord.js";


const router = express.Router();

// GET all records (for admin/superadmin analytics)
router.get("/all", checkAuth, async (req, res) => {
  try {
    const records = await PatientRecord.find()
      .populate("patient", "name email")
      .populate("doctor", "name email");
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET records by patient ID
router.get("/by-patient/:id", checkAuth, async (req, res) => {
  try {
    const records = await PatientRecord.find({ patient: req.params.id })
      .populate("doctor", "name email")
      .sort({ visitDate: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET records by doctor ID
router.get("/by-doctor/:id", checkAuth, async (req, res) => {
  try {
    const records = await PatientRecord.find({ doctor: req.params.id })
      .populate("patient", "name email")
      .sort({ visitDate: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single record by record ID
router.get("/:recordId", checkAuth, async (req, res) => {
  try {
    const record = await PatientRecord.findById(req.params.recordId)
      .populate("patient", "name email")
      .populate("doctor", "name email")
      .populate("labReports");
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADD new patient record (Doctor or Admin usually does this)
router.post("/add", checkAuth, async (req, res) => {
  try {
    const newRecord = new PatientRecord(req.body);
    await newRecord.save();
    res.status(201).json({ message: "Record added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE record only by admin and super admin
router.patch("/update/:id", checkAuth, async (req, res) => {
  try {
    const updated = await PatientRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//only will be delete by super admin 
router.delete("/delete/:id", checkAuth, async (req, res) => {
  try {
    const deleted = await PatientRecord.findByIdAndDelete(req.params.id);
    res.json({ message: "Record deleted successfully", deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
