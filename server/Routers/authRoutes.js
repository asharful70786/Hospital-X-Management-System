import express from "express"
import limiter from "../utils/limiter.js";
import {
  forgetPAssResetAPss,
  forgetPassSendOtp,
  forgetPAssVerifyOtp,
  registerUser,
  SendOtp,
  verifyOtp
} from "../Controllers/authControllers.js";
import User from "../Models/userModel.js";
const router = express.Router();
import bcrypt from "bcrypt"
import Session from "../Models/sessionModel.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//req like : http://localhost:4000/auth/...
router.post("/send-otp", limiter, SendOtp)
router.post("/verify-otp", verifyOtp)
router.post("/register", limiter, registerUser);
router.post("/forgot-password/send-otp", limiter, forgetPassSendOtp);
router.post("/forgot-password/verify-otp", forgetPAssVerifyOtp);
router.post("/forgot-password/reset-password", forgetPAssResetAPss);



router.post("/login", limiter, async (req, res) => {
  const { sid } = req.signedCookies;
  // console.log("sid", sid);
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
  if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid email format" });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found , please register" });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });
    //Im continue session logic with Mongodb  
    const allSessions = await Session.find({ userId: user._id });
    if (allSessions.length >= 2) {
      let oldestSession = allSessions[0];
      await Session.deleteOne({ _id: oldestSession._id });
    }

    await Session.create({ userId: user._id });
    res.cookie("sid", user._id.toString(), {
      httpOnly: true,
      signed: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.log("error in login", error);
    res.status(500).json({ error: error.message });
  }

})
export default router;

