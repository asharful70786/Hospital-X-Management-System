import express from "express";
import checkAuth from "../middleWare/checkAuthMiddleWare.js";
import allow from "../middleWare/accessAllow.js";
import role from "../utils/roles.js";
import { addMedicine, deleteMedicine, getAllMedicines, getMedicineById, updateMedicine } from "../controllers/medicineController.js";

const router = express.Router();

router.get("/all", checkAuth, allow(role.Pharmacist), getAllMedicines);

router.post("/add", checkAuth, allow(role.Pharmacist), addMedicine)
router.get("/single/:id", checkAuth, allow(role.Pharmacist), getMedicineById); // i can also  see single medicine in front box componet if needed 

router.patch("/update/:id", checkAuth, allow(role.Pharmacist), updateMedicine)

router.delete("/delete/:id", checkAuth, allow(role.Pharmacist), deleteMedicine)



export default router;