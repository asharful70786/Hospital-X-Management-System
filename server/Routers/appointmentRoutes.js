import express from "express";
import checkAuth from "../middleWare/checkAuthMiddleWare.js";
import role from "../utils/roles.js";
import allow from "../middleWare/accessAllow.js";
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


//   Only Admin and Receptionist can see the full appointment list
router.get("/", checkAuth, allow(role.Admin, role.Receptionist), getAllAppointments);

//  GET a single appointment by ID
router.get("/single/:id", checkAuth, allow(role.Admin, role.Receptionist), getSingleAppointment);

//  POST create a new appointment (admin/receptionist)
router.post("/add", checkAuth, allow(role.Admin, role.Receptionist), makeAppointment);

//  PATCH update appointment
router.patch("/update/:id", checkAuth, allow(role.Admin, role.Receptionist), updateAppointment);

//  DELETE appointment (admin-level access)
router.delete("/delete/:id", checkAuth, allow(role.Admin, role.Receptionist), deleteAppointment);

//  GET appointments by patient
router.get("/by-patient/:id", checkAuth, allow(role.Admin, role.Receptionist, role.Patient), getAllAppointmentsByPatientId);

//  GET appointments by doctor ID
router.get("/by-doctor/:id", checkAuth, allow(role.Doctor), getAppointmentsByDoctorId);

//  POST book appointment (with slot + leave validation)
router.post("/book", checkAuth, allow(role.Patient), bookAppointment);

//  GET all appointments for logged-in doctor (dashboard view)
router.get("/appointments", checkAuth, allow(role.Doctor), getDoctorAppointments);

//  GET available time slots for a doctor on a specific date - holiday Time for Doctor 
router.get("/available-slots/:id", checkAuth, allow(role.Receptionist), getAvailableSlotsByDoctor);

export default router;
