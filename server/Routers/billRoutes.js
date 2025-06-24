import express from "express";
import checkAuth from "../middleWare/checkAuthMiddleWare.js";
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

router.post("/get", checkAuth, createBill);
router.get("/today", checkAuth, getTodayCollection);
router.get("/monthly", checkAuth, getMonthlyCollection);
router.get("/by-department", checkAuth, getDepartmentWiseBills);
router.get("/daily-income", getDailyIncome);
router.get("/payment-mode-summary", getPaymentModeSummary);
router.get("/monthly-trend", getMonthlyBillingTrend);



export default router;
