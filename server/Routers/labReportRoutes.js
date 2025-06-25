import express from "express";
import checkAuth from "../middleWare/checkAuthMiddleWare.js";
import LabReport from "../Models/LabReport.js";
import { addlabReport, deleteLabReport, getAllLabReports, patientLabReportAccess, updateLabReport } from "../controllers/labReportControllers.js";
const router = express.Router();


//http://localhost:4000/report/...
router.get("/all", checkAuth, getAllLabReports);

//this  will only access by the user who's is it 
// condition apply  soon 
router.get("/single/:id", checkAuth, patientLabReportAccess);

router.post("/add", checkAuth, addlabReport);


router.patch("/update/:id", checkAuth, updateLabReport);

router.delete("/delete/:id", checkAuth, deleteLabReport);


export default router; 