import express from "express";
import checkAuth from "../middleWare/checkAuthMiddleWare.js";
import {
  bookAppointment,
  getAllAppointments,
  getAllAppointmentsByPatientId,
  getSingleAppointment,
  getDoctorAppointments,
  makeAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByDoctorId,
  getAvailableSlotsByDoctor,
} from "../controllers/appointmentController.js";

const router = express.Router();

// Middleware: allow superAdmin/admin/receptionist only
const bySuperAdmin = async (req, res, next) => {
  const user = req.user;
  if (["superAdmin", "admin", "receptionist"].includes(user.role)) return next();
  return res.status(403).json({ message: "You are not authorized to access this route." });
};

//  GET all appointments (admin/receptionist access)
router.get("/", checkAuth, bySuperAdmin, getAllAppointments);

//  GET a single appointment by ID
router.get("/single/:id", checkAuth, getSingleAppointment);

//  POST create a new appointment (admin/receptionist)
router.post("/add", checkAuth, makeAppointment);

//  PATCH update appointment
router.patch("/update/:id", checkAuth, updateAppointment);

//  DELETE appointment (admin-level access)
router.delete("/delete/:id", checkAuth, bySuperAdmin, deleteAppointment);

//  GET appointments by patient
router.get("/by-patient/:id", checkAuth, getAllAppointmentsByPatientId);

//  GET appointments by doctor ID
router.get("/by-doctor/:id", checkAuth, getAppointmentsByDoctorId);

//  POST book appointment (with slot + leave validation)
router.post("/book", checkAuth, bookAppointment);

//  GET all appointments for logged-in doctor (dashboard view)
router.get("/doctor", checkAuth, getDoctorAppointments);

//  GET available time slots for a doctor on a specific date
router.get("/available-slots/:id", checkAuth, getAvailableSlotsByDoctor);

export default router;
