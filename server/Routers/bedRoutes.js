import express from "express";
import checkAuth from "../middleWare/checkAuthMiddleWare.js";
import Bed from "../Models/Bed.js";
import { addBed, deleteBed, getAllBeds, updateBedCapacity } from "../controllers/bedController.js";

const router = express.Router();


router.get("/all", checkAuth, getAllBeds);

router.post("/add", checkAuth, addBed)

router.delete("/delete/:id", checkAuth, deleteBed);

router.patch("/update/:id", checkAuth, updateBedCapacity);




export default router;