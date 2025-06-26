import express from "express"
import limiter from "../utils/limiter.js";
const router = express.Router();

import { currentUser, forgetPAssResetAPss, forgetPassSendOtp, forgetPAssVerifyOtp, login, logout, logOut_AllDevices, registerUser, SendOtp, verifyOtp } from "../controllers/authControllers.js";
import checkAuth from "../middleWare/checkAuthMiddleWare.js";



//req like : http://localhost:4000/auth/...
router.post("/send-otp", limiter, SendOtp)
router.post("/verify-otp", verifyOtp)
router.post("/register", limiter, registerUser);


router.post("/forgot-password/send-otp", limiter, forgetPassSendOtp);
router.post("/forgot-password/verify-otp", forgetPAssVerifyOtp);
router.post("/forgot-password/reset-password", forgetPAssResetAPss);

router.post("/login", login)
 
router.post("/logout", checkAuth, logout);
router.post("/logout-all", checkAuth,  logOut_AllDevices);

router.post("/current-user", checkAuth, currentUser);


export default router;

