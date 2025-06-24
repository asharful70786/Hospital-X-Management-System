import nodemailer from "nodemailer";
import OTP from "../Models/otpModel.js";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODE_MAILER_EMAIL,
    pass: process.env.NODE_MAILER_PASSWORD,
  },
});

async function sendMail(email) {
  const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  await OTP.findOneAndUpdate(
    { email },
    { otp: otpCode, expiresAt: expiry },
    { upsert: true, new: true }
  );

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;">
        <div style="background-color: #4f46e5; padding: 20px; color: #ffffff; text-align: center;">
          <h2 style="margin: 0;">Hospital X</h2>
          <p style="margin: 5px 0;">Secure Login Verification</p>
        </div>
        <div style="padding: 30px; text-align: center;">
          <h3 style="margin-bottom: 10px;">Your OTP Code</h3>
          <div style="font-size: 32px; font-weight: bold; color: #4f46e5; letter-spacing: 4px; margin: 20px 0;">
            ${otpCode}
          </div>
          <p style="color: #555;">This OTP is valid for the next <strong>10 minutes</strong>. Please do not share it with anyone.</p>
        </div>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #888;">
          <p>Didn’t request this email? You can ignore it.</p>
          <p>© ${new Date().getFullYear()} Hospital X. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: '"Hospital X" <ashrafulmomin2@gmail.com>',
    to: email,
    subject: "Your OTP for Hospital X Login",
    html: htmlContent,
  });
}

export default sendMail;
