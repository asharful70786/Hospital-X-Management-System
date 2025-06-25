import express from "express";
import checkAuth from "../middleWare/checkAuthMiddleWare.js";
import { getAllAppointments, getAllAppointmentsByPatientId, getSingleAppointment, makeAppointment, updateAppointment } from "../controllers/appointmentController.js";

const router = express.Router();

//http://localhost:4000/appointment/...

async function bySuperAdmin(req, res, next) {
  const user = req.user;
  if (user.role === "superAdmin" || user.role === "admin" || user.role === "receptionist") {
    return next();
  }
  else {
    return res.status(403).json({ message: "You are not authorized to see the Contents of this page" });
  }
}

router.get("/", checkAuth, bySuperAdmin, getAllAppointments);


//opnly view by receptionist / patient / receptionist
router.get("/single/:id", checkAuth, getSingleAppointment)


router.post("/add", checkAuth, makeAppointment);

router.patch("/update/:id", checkAuth, updateAppointment);


// GET appointments by patient ID
router.get("/by-patient/:id", checkAuth, getAllAppointmentsByPatientId);

// GET appointments by doctor ID
router.get("/by-doctor/:id", checkAuth,);


//access by admin / super admin 
router.delete("/delete/:id", checkAuth,);


export default router;