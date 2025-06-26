import express from "express";
import checkAuth from "../middleWare/checkAuthMiddleWare.js";
import allow from "../middleWare/accessAllow.js";
import role from "../utils/roles.js";
import { addlabReport, deleteLabReport, getAllLabReports, patientLabReportAccess, updateLabReport } from "../controllers/labReportControllers.js";
import upload from "../middleWare/multerMiddleware.js";



const router = express.Router();


//http://localhost:4000/report/...
router.get("/all", checkAuth, allow(role.Receptionist, role.Admin, role.LabTech, role.Doctor), getAllLabReports);

//this  will only access by the user who's is it 
// condition apply  soon 
router.get("/single/:id", checkAuth, allow(role.Patient), patientLabReportAccess);

router.post("/add", checkAuth, allow(role.LabTech), upload.single("file"), addlabReport);


router.patch("/update/:id", checkAuth, allow(role.LabTech, role.Doctor), updateLabReport);


router.delete("/delete/:id", checkAuth, allow(role.Admin), deleteLabReport);


export default router; 