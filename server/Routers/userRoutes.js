import express from "express";
import checkAuth from "../middleWare/checkAuthMiddleWare.js";
import User from "../Models/userModel.js";
import { deactivateUsers, getallUsers, getUsersByDepartment, getUsersByRole, upDateUserById } from "../controllers/userController.js";

const router = express.Router();



// GET /api/users/all - Get all users (admin only)
router.get("/all", checkAuth, getallUsers);

// GET /api/users/by-role/:role - Get users by role (e.g., "Doctor", "Patient")
router.get("/by-role/:role", checkAuth, getUsersByRole);

// GET /api/users/by-department/:id - Get users in a department (mainly doctors/nurses)
router.get("/by-department/:id", checkAuth,getUsersByDepartment );

// PATCH /api/users/update/:id - Update user profile (email, phone, avatar)
router.patch("/update/:id", checkAuth, upDateUserById);

// PATCH /api/users/deactivate/:id - Deactivate user account
router.patch("/deactivate/:id", checkAuth, deactivateUsers);

export default router;
