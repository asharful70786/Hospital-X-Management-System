// src/routes/leaveRoute.js
import express from "express";
import checkAuth from "../middleWare/checkAuthMiddleWare.js";
import role from "../utils/roles.js";
import allow from "../middleWare/accessAllow.js";
import {
  applyDoctorLeave,
  getDoctorLeaves,
  getLeavesByDate,
} from "../controllers/leaveController.js";

const router = express.Router();

// GET all leaves of a doctor
router.get("/by-doctor/:id", checkAuth, allow(role.Doctor), getDoctorLeaves);

// POST apply for leave
router.post("/apply", checkAuth, allow(role.Doctor), applyDoctorLeave);
router.get("/", checkAuth, allow(role.Doctor, role.Receptionist, role.Admin),
  getLeavesByDate
);

export default router;
