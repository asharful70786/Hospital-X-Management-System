import express from "express";
import Prescription from "../Models/Prescription.js";

//http://localhost:4000/prescriptions/...

const router = express.Router();

// Get all prescriptions with doctor & patient populated
router.get("/", async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate("patient", "name email")
      .populate("doctor", "name email");
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get prescriptions by patient ID
router.get("/by-patient/:id", async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.params.id })
      .populate("doctor", "name email");
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get prescriptions by doctor ID
router.get("/by-doctor/:id", async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ doctor: req.params.id })
      .populate("patient", "name email");
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new prescription
router.post("/add", async (req, res) => {
  try {
    const newItem = new Prescription(req.body);
    await newItem.save();
    return res.status(201).json({ message: "Prescription added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update prescription
router.patch("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItem = await Prescription.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete prescription (only by SuperAdmin later)
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Prescription.findByIdAndDelete(id);
    res.json(deletedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
