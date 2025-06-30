import express from "express";
import checkAuth from "../middleWare/checkAuthMiddleWare.js";
import allow from "../middleWare/accessAllow.js";
import role from "../utils/roles.js";
import {
  addNewPatientRecord,
  deletePatientRecord,
  getAllRecords,
  getRecordByDoctorId,
  getRecordByPatientId,
  getSingleRecord,
  updatePatientRecord
} from "../controllers/recordControlers.js";

const router = express.Router();

// GET all records — Admin & SuperAdmin (analytics, audit)
router.get("/all-records", checkAuth, allow(role.Admin, role.SuperAdmin), getAllRecords);

// GET records by patient ID — Doctor & Nurse only
router.get("/by-patient/:id", checkAuth, allow(role.Doctor, role.Nurse), getRecordByPatientId);

// GET records by doctor ID — Doctor only
router.get("/by-doctor/:id", checkAuth, allow(role.Doctor), getRecordByDoctorId);

// GET single record — Doctor & Nurse only
router.get("/:recordId", checkAuth, allow(role.Doctor, role.Nurse), getSingleRecord);

// POST add record — Doctor only
router.post("/add", checkAuth, allow(role.Doctor), addNewPatientRecord);

// PATCH update record — Doctor only
router.patch("/update/:id", checkAuth, allow(role.Doctor), updatePatientRecord);

// DELETE record — SuperAdmin only
router.delete("/delete/:id", checkAuth, allow(role.SuperAdmin), deletePatientRecord);

export default router;
