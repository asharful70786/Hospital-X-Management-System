import express from "express"
import limiter from "../utils/limiter.js";
import { forgetPAssResetAPss, forgetPassSendOtp, forgetPAssVerifyOtp, registerUser, SendOtp, verifyOtp } from "../controllers/userController.js";
const router = express.Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//req like : http://localhost:4000/api/...
router.post("/send-otp", limiter, SendOtp)
router.post("/verify-otp", verifyOtp)
router.post("/register", limiter, registerUser);
router.post("/forgot-password/send-otp", limiter, forgetPassSendOtp);

router.post("/forgot-password/verify-otp", forgetPAssVerifyOtp);
router.post("/forgot-password/reset-password", forgetPAssResetAPss);


export default router;
