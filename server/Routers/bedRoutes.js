import express from "express";
import checkAuth from "../middleWare/checkAuthMiddleWare.js";
import { addBed, deleteBed, getAllBeds, updateBedCapacity } from "../controllers/bedController.js";
import allow from "../middleWare/accessAllow.js";
import role from "../utils/roles.js";
const router = express.Router();


router.get("/all", checkAuth, allow(role.Admin, role.Receptionist), getAllBeds);

// Only Admin should be allowed to hit this
router.post("/add", checkAuth, allow(role.Admin), addBed)

// Only Super Admin should be allowed to hit this
router.delete("/delete/:id", checkAuth, allow(role.SuperAdmin), deleteBed);

router.patch("/update/:id", checkAuth, allow(role.Receptionist, role.Admin), updateBedCapacity);




export default router;