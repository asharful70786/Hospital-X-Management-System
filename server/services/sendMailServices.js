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

// ✅ Unified mail sender
async function sendMail({ email, msgType = "register", dynamicData = {} }) {
  let subject = "";
  let messageHeading = "";
  let htmlContent = "";

  // ✅ OTP Email
  if (msgType === "register" || msgType === "forgot") {
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    await OTP.findOneAndUpdate(
      { email },
      { otp: otpCode, expiresAt: expiry },
      { upsert: true, new: true }
    );

    subject =
      msgType === "register"
        ? "Your OTP for Hospital X Registration"
        : "Reset Password OTP - Hospital X";
    messageHeading =
      msgType === "register" ? "Complete Your Registration" : "Reset Your Password";

    htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px;">
          <div style="background-color: #4f46e5; padding: 20px; color: #ffffff; text-align: center;">
            <h2 style="margin: 0;">Hospital X</h2>
            <p>${messageHeading}</p>
          </div>
          <div style="padding: 30px; text-align: center;">
            <h3>Your OTP Code</h3>
            <div style="font-size: 32px; font-weight: bold; color: #4f46e5; letter-spacing: 4px;">
              ${otpCode}
            </div>
            <p>This OTP is valid for <strong>10 minutes</strong>. Please do not share it.</p>
          </div>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #888;">
            <p>If you didn’t request this, you can ignore this email.</p>
            <p>© ${new Date().getFullYear()} Hospital X. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;
  }

  // ✅ Lab Report Notification
  else if (msgType === "lab_report_ready") {
    const { patientName, testType, reportUrl, resultImage } = dynamicData;

    subject = "Your Lab Report is Ready – Hospital X";
    messageHeading = "Lab Report Completed";

    htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px;">
          <div style="background-color: #4f46e5; padding: 20px; color: #ffffff; text-align: center;">
            <h2 style="margin: 0;">Hospital X</h2>
            <p>${messageHeading}</p>
          </div>
          <div style="padding: 30px;">
            <p>Hello ${patientName || "Patient"},</p>
            <p>Your lab report for <strong>${testType}</strong> is now available.</p>
            <p>
              <a href="${reportUrl}" style="background: #4f46e5; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;" target="_blank">
                View Report
              </a>
            </p>
            ${
              resultImage
                ? `<img src="${resultImage}" alt="Lab Report" style="max-width:100%; margin-top: 20px;" />`
                : ""
            }
          </div>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #888;">
            <p>This report is confidential and intended only for the recipient.</p>
            <p>© ${new Date().getFullYear()} Hospital X. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;
  }

  // ✅ Default Fallback
  else {
    subject = "Message from Hospital X";
    messageHeading = "Notification";
    htmlContent = `
      <div style="padding: 40px; font-family: Arial; text-align: center;">
        <h2>${messageHeading}</h2>
        <p>This is a system-generated message from Hospital X.</p>
      </div>
    `;
  }

  // ✅ Send the email
  await transporter.sendMail({
    from: `"Hospital X" <${process.env.NODE_MAILER_EMAIL}>`,
    to: email,
    subject,
    html: htmlContent,
  });
}

export default sendMail;
