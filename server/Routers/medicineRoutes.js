import express from "express";
import checkAuth from "../middleWare/checkAuthMiddleWare.js";
import Medicine from "../Models/Medicine.js";
import { addMedicine, deleteMedicine, getAllMedicines, getMedicineById, updateMedicine } from "../controllers/medicineController.js";

const router = express.Router();

router.get("/all", checkAuth, getAllMedicines);

router.post("/add", checkAuth, addMedicine)

router.get("/single/:id", checkAuth, getMedicineById); // i can also  see single medicine in front box componet if needed 

router.patch("/update/:id", checkAuth, updateMedicine)

router.delete("/delete/:id", checkAuth, deleteMedicine)



export default router;