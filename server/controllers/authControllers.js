import OTP from "../Models/otpModel.js";
import Session from "../Models/sessionModel.js";
import User from "../Models/userModel.js";
import sendMail from "../services/sendMailServices.js";
import bcrypt from "bcrypt";
import { loginSchema, otpValidation, registerSchema } from "../validation/zodValidation.js";
import { z } from "zod/v4";
import logger from "../utils/logger.js";


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


export const login = async (req, res) => {
  const { success, error, data } = loginSchema.safeParse(req.body);
  if (!success) return res.status(400).json({ error: z.flattenError(error) });
  const { email, password } = data;
  if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
  if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid email format" });
  try {

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found , please register" });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });

    const allSessions = await Session.find({ userId: user._id }).sort({ createdAt: 1 });
    if (allSessions.length >= 2) {
      const oldestSession = allSessions[0];
      await Session.deleteOne({ _id: oldestSession._id });
    }
    const session = await Session.create({ userId: user._id });
    res.cookie("sid", session._id.toString(), {
      httpOnly: true,
      signed: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000 * 7 //  7 day
    });
    logger.info(`Login by ${user.name} - (${user.email})`);
    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.log("error in login", error);
    res.status(500).json({ error: error.message });
  }
}

export const SendOtp = async (req, res) => {
  const { success, error, data } = loginSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ error: z.flattenError(error) });
  }
  const { email } = data;
  if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid email format" });
  if (!email) return res.status(400).json({ message: "Email  is  required" })
  try {
    const existenceUser = await User.findOne({ email })
    if (existenceUser) return res.status(400).json({ message: "User already exists" });
    await sendMail(email, "register");
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log("error on send otp", error);
    res.send(error.message);
  }
}

export const verifyOtp = async (req, res) => {
  const { success, error, data } = otpValidation.safeParse(req.body);
  if (!success) return res.status(400).json({ error: z.flattenError(error) });
  const { email, otp } = data;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP are  required" });
  try {
    let matchUser = await OTP.findOne({ email, otp });
    if (!matchUser)
      return res.status(400).json({ message: "Invalid or expired OTP" });
    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("Error during registration OTP:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
}

export const registerUser = async (req, res) => {
  const { success, error, data } = registerSchema.safeParse(req.body);
  if (!success) return res.status(400).json({ error: z.flattenError(error) });
  const { email, name, password } = data;
  if (!email || !name || !password) return res.status(400).json({ message: "Name , Email and password are  required" });
  if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid email format" });
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    let hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, name, password: hashedPassword });
    await user.save();
    return res.status(200).json({ message: "User registered successfully" });

  } catch (err) {
    console.error("Error during user registration:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const forgetPassSendOtp = async (req, res) => {
  if (!emailRegex.test(req.body.email)) return res.status(400).json({ message: "Invalid email format" });
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(404).json({ message: "User not found" });
    await sendMail(email, "forgot");
    return res.json({ message: "OTP for password reset sent successfully" });
  } catch (error) {
    console.error("Error on forgot-password/send-otp:", error);
    res.status(500).send("Failed to send OTP");
  }
}

export const forgetPAssVerifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });
  try {
    let matchUser = await OTP.findOne({ email, otp });
    if (!matchUser) return res.status(400).json({ message: "Invalid or expired OTP" });
    matchUser.verified = true;
    await matchUser.save();
    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("Error during forgot-password/verify-otp:", err);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
}

export const forgetPAssResetAPss = async (req, res) => {
  if (!emailRegex.test(req.body.email)) return res.status(400).json({ message: "Invalid email format" });
  const { email, newPassword } = req.body;

  if (!email || !newPassword)
    return res.status(400).json({ message: "Email and new password are required" });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otpEntry = await OTP.findOne({ email });
    if (!otpEntry || !otpEntry.verified) {
      return res.status(400).json({ message: "OTP not verified or session expired" });
    }
    const samePassword = await bcrypt.compare(newPassword, user.password);
    if (samePassword) {
      return res.status(400).json({ message: "New password must be different from the current password" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    await OTP.deleteOne({ email });
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Error during forgot-password/reset-password:", err);
    res.status(500).json({ message: "Failed to reset password" });
  }
}

export const currentUser = async (req, res) => {
  const user = req.user;
  try {
    res.status(200).json(user);
  } catch (error) {
    console.log("error in current user", error);
    res.status(500).json({ error: error.message });
  }
};

export const logout = async (req, res) => {
  const { sid } = req.signedCookies;
  try {
    await Session.deleteOne({ _id: sid });
    res.clearCookie("sid");
    logger.info(`Logout by ${req.user.role} - (${req.user._id})`);
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log("error in logout", error);
    res.status(500).json({ error: error.message });
  }
};

export const logOut_AllDevices = async (req, res) => {
  const { sid } = req.signedCookies;
  console.log(sid);
  try {
    await Session.deleteMany({ userId: req.user._id });
    res.clearCookie("sid");
    logger.info(`Logout from all devices by ${req.user.role} - (${req.user._id})`);
    return res.status(200).json({
      message: "Logout successful from all devices",
    });
  } catch (error) {
    console.error("error in logout all devices", error);
    res.status(500).json({ error: error.message });
  }
};
