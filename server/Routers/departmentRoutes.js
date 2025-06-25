import express from "express";
import checkAuth from "../middleWare/checkAuthMiddleWare.js";
import { addNewDepartment, deleteDepertment, getAllDepartments, getSingleDepartment, updateDepartmentDetails } from "../controllers/departmentControllers.js";

//localhost:4000/department/..

const router = express.Router();


router.get("/all", checkAuth, getAllDepartments);


router.get("/:id", checkAuth, getSingleDepartment);

// ADD a new department
router.post("/add", checkAuth, addNewDepartment);


router.patch("/update/:id", checkAuth, updateDepartmentDetails);

router.delete("/delete/:id", checkAuth, deleteDepertment);

export default router;
