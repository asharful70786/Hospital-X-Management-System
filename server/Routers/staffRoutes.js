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

//admin/ superadmin /  receptionist 
router.get("/all", checkAuth, allow(role.Admin, role.Receptionist), getAllStaff);

router.get("/active", checkAuth, allow(role.Admin, role.Receptionist), getActiveStaff);

// GET staff by role
//alos acces by the depertment head
router.get("/by-role/:role", checkAuth, allow(role.Admin, role.Receptionist, role.Doctor), getUserByRole);



router.get("/by-department/:id", checkAuth, allow(role.Admin, role.Receptionist), getUsersByDepartmentId);

router.get("/single/:id", checkAuth, allow(role.Admin), getSingleStaff);

router.patch("/update/:id", checkAuth, allow(role.Admin, role.Receptionist), updateStaffDetails);

// Only SuperAdmin/Admin  and department head should be allowed to hit this
router.post("/add", checkAuth, allow(role.Admin, role.Doctor ), AddStaff);


// Mark staff as inactive
router.patch("/remove/:id", checkAuth, allow(role.Admin, role.Doctor), markStaffInActive);

export default router;