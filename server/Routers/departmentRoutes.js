import express from "express";
import checkAuth from "../middleWare/checkAuthMiddleWare.js";
import allow from "../middleWare/accessAllow.js";
import role from "../utils/roles.js";
import { addNewDepartment, deleteDepertment, getAllDepartments, getSingleDepartment, updateDepartmentDetails } from "../controllers/departmentControllers.js";

//localhost:4000/department/..

const router = express.Router();


router.get("/all", checkAuth, allow(role.Admin, role.Receptionist), getAllDepartments);


router.get("/:id", checkAuth, allow(role.Admin, role.Receptionist), getSingleDepartment);

// ADD a new department
router.post("/add", checkAuth, allow(role.SuperAdmin), addNewDepartment);

//also the doctor if  he head of the department
router.patch("/update/:id", checkAuth, allow(role.Admin, role.Receptionist, role.Doctor), updateDepartmentDetails);

router.delete("/delete/:id", checkAuth, allow(role.SuperAdmin), deleteDepertment);

export default router;
