import express from "express";
const router = express.Router();
import checkAuth from "../middleWare/checkAuthMiddleWare.js";
import allow from "../middleWare/accessAllow.js";
import role from "../utils/roles.js";
import {
  AddStaff,
  getActiveStaff,
  getAllStaff,
  getSingleStaff,
  getUserByRole,
  getUsersByDepartmentId,
  markStaffInActive,
  updateStaffDetails
} from "../controllers/staffControllers.js";
import logger from "../utils/logger.js";
import User from "../Models/userModel.js";

//admin/ superadmin /  receptionist 
router.get("/all", checkAuth, allow(role.Admin, role.Receptionist, role.SuperAdmin), getAllStaff);

router.get("/active", checkAuth, allow(role.Admin, role.Receptionist), getActiveStaff);

// GET staff by role
//also access by the department head
router.get("/by-role/:role", checkAuth, allow(role.Admin, role.Receptionist, role.Doctor , role.LabTech), getUserByRole);



router.get("/by-department/:id", checkAuth, allow(role.Admin, role.Receptionist), getUsersByDepartmentId);

router.get("/single/:id", checkAuth, allow(role.Admin), getSingleStaff);

router.patch("/update/:id", checkAuth, allow(role.Admin, role.Receptionist), updateStaffDetails);

// Only SuperAdmin/Admin  and department head should be allowed to hit this
router.post("/add", checkAuth, allow(role.Admin, role.Doctor), AddStaff);

//localhost:4000/staff/add-patient
router.post("/add-patient", checkAuth, allow(role.Doctor), async (req, res) => {
  const { name, email } = req.body;
  const currentUser = req.user;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  try {
    // Step 1: Check if patient already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(`Doctor (${currentUser._id}) attempted to re-add patient ${existingUser._id}`);
      return res.status(409).json({ message: "Patient already exists", user: existingUser });
    }

    // Step 2: Create new user with Patient role
    const newPatient = await User.create({
      name,
      email,
      role: "Patient",
    });

    logger.warn(`Doctor (${currentUser._id}) added new patient ${newPatient._id}`);

    return res.status(201).json({ message: "Patient created", user: newPatient });
  } catch (error) {
    logger.error(`Error adding patient by doctor ${currentUser._id}: ${error.message}`);
    return res.status(500).json({ message: "Failed to add patient", error: error.message });
  }
});


// Mark staff as inactive
router.patch("/remove/:id", checkAuth, allow(role.Admin, role.Doctor), markStaffInActive);

export default router;