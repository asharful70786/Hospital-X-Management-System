import express from "express";
import checkAuth from "../middleWare/checkAuthMiddleWare.js";
import allow from "../middleWare/accessAllow.js";
import role from "../utils/roles.js";
import {
  createBill,
  getTodayCollection,
  getMonthlyCollection,
  getDepartmentWiseBills,
  getDailyIncome,
  getPaymentModeSummary,
  getMonthlyBillingTrend
} from "../controllers/billController.js";

const router = express.Router();

//fully Bill related Info access By SuperAdmin And  Admin
//cause if i allow receptionist  he can guess all Incopme so . 
router.post("/create", checkAuth, allow(role.Admin, role.SuperAdmin), createBill);
router.get("/today", checkAuth, allow(role.Admin), getTodayCollection);
router.get("/monthly", checkAuth, allow(role.Admin), getMonthlyCollection);
router.get("/by-department", checkAuth, allow(role.Admin), getDepartmentWiseBills);
router.get("/daily-income", checkAuth, allow(role.Admin), getDailyIncome);
router.get("/payment-mode-summary", checkAuth, allow(role.Admin), getPaymentModeSummary);
router.get("/monthly-trend", checkAuth, allow(role.Admin), getMonthlyBillingTrend);



export default router;
