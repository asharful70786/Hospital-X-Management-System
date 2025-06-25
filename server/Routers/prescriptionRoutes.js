import express from "express";
import { addNewPrescription, deleteprescription, getAllPrescriptions, getPrescriptionsByDoctorId, getPrescriptionsByPatientId, updatePrescription } from "../controllers/prescriptionController.js";
import checkAuth from "../middleWare/checkAuthMiddleWare.js";



//http://localhost:4000/prescriptions/...

const router = express.Router();

// Get all prescriptions with doctor & patient populated
router.get("/", checkAuth, getAllPrescriptions);

// Get prescriptions by patient ID
router.get("/by-patient/:id", checkAuth, getPrescriptionsByPatientId);

// Get prescriptions by doctor ID
router.get("/by-doctor/:id", checkAuth, getPrescriptionsByDoctorId);

// Add new prescription
router.post("/add", checkAuth, addNewPrescription);

// Update prescription
router.patch("/update/:id", checkAuth, updatePrescription);

// Delete prescription (only by SuperAdmin later)
router.delete("/delete/:id", checkAuth, deleteprescription);

export default router;
