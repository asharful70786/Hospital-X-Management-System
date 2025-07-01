import express from "express";
import allow from "../middleWare/accessAllow.js";
import role from "../utils/roles.js";
import {
  addNewPrescription,
  deleteprescription,
  getAllPrescriptions,
  getPrescriptionsByDoctorId,
  getPrescriptionsByPatientId,
  updatePrescription
} from "../controllers/prescriptionController.js";

import checkAuth from "../middleWare/checkAuthMiddleWare.js";

const router = express.Router();

// GET all prescriptions — Admin, Receptionist, Doctor
router.get("/all", checkAuth,
  allow(role.Admin, role.Receptionist),
  getAllPrescriptions
);

// GET prescriptions by patient ID — Doctor, Patient, Nurse
router.get("/by-patient/:id", checkAuth,
  allow(role.Doctor, role.Patient, role.Nurse),
  getPrescriptionsByPatientId
);


router.get("/by-doctor/:id", checkAuth,
  allow(role.Doctor, role.Admin),
  getPrescriptionsByDoctorId
);

// POST add prescription — Doctor only
router.post("/add", checkAuth, allow(role.Doctor), addNewPrescription);

// PATCH update prescription — Doctor only
router.patch("/update/:id", checkAuth,
  allow(role.Doctor),
  updatePrescription
);

// DELETE prescription — SuperAdmin only
router.delete("/delete/:id", checkAuth,
  allow(role.SuperAdmin),
  deleteprescription
);

export default router;
