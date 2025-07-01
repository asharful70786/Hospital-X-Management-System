import express from "express";
import checkAuth from "../middleWare/checkAuthMiddleWare.js";
import allow from "../middleWare/accessAllow.js";
import role from "../utils/roles.js";
import {
  getDoctorAvailability,
  createOrUpdateAvailability,
  deleteAvailability,
} from "../controllers/doctorAvailabilityController.js";

const router = express.Router();

router.get("/:id", checkAuth, allow(role.Doctor , role.Receptionist), getDoctorAvailability);
router.post("/", checkAuth, allow(role.Doctor), createOrUpdateAvailability);
router.delete("/:id", checkAuth, allow(role.Doctor), deleteAvailability);

export default router;
