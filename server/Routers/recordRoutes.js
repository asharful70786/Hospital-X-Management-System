import express from "express";
import checkAuth from "../middleWare/checkAuthMiddleWare.js";
import { addNewPatientRecord, deletePatientRecord, getAllRecords, getRecordByDoctorId, getRecordByPatientId, getSingleRecord, updatePatientRecord } from "../controllers/recordControlers.js";


const router = express.Router();

// GET all records (for admin/superadmin analytics)
router.get("/all", checkAuth, getAllRecords);

// GET records by patient ID
router.get("/by-patient/:id", checkAuth, getRecordByPatientId);

// GET records by doctor ID
router.get("/by-doctor/:id", checkAuth, getRecordByDoctorId);

// GET single record by record ID
router.get("/:recordId", checkAuth, getSingleRecord);

// ADD new patient record (Doctor or Admin usually does this)
router.post("/add", checkAuth, addNewPatientRecord);

// UPDATE record only by admin and super admin
router.patch("/update/:id", checkAuth, updatePatientRecord);
//only will be delete by super admin 
router.delete("/delete/:id", checkAuth, deletePatientRecord);

export default router;
