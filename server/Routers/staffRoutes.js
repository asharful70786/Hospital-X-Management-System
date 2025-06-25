import express from "express";
const router = express.Router();

import checkAuth from "../middleWare/checkAuthMiddleWare.js";
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
router.get("/all", checkAuth, getAllStaff);
router.get("/active", checkAuth, getActiveStaff);


router.get("/by-role/:role", checkAuth, getUserByRole);



router.get("/by-department/:id", checkAuth, getUsersByDepartmentId);
router.get("/single/:id", checkAuth, getSingleStaff);

router.patch("/update/:id", checkAuth, updateStaffDetails);

// Only SuperAdmin/Admin should be allowed to hit this
router.post("/add", checkAuth, AddStaff);


// Mark staff as inactive
router.patch("/remove/:id", checkAuth, markStaffInActive);
export default router