import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoute from "./Routers/authRoutes.js";
import userRoute from "./Routers/userRoutes.js";
import inventoryRoute from "./Routers/inventoryRoutes.js";
import medicineRoute from "./Routers/medicineRoutes.js";
import labReportRoute from "./Routers/labReportRoutes.js";
import bedRoute from "./Routers/bedRoutes.js";
import billRoutes from "./Routers/billRoutes.js";
import prescriptionRoutes from "./Routers/prescriptionRoutes.js";
import appointmentRoute from "./Routers/appointmentRoutes.js";
import recordRoute from "./Routers/recordRoutes.js";
import staffRoute from "./Routers/staffRoutes.js";
import departMentRoute from "./Routers/departmentRoutes.js";
import leaveRoute from "./Routers/leaveRoute.js"
import availabilityRoute from "./Routers/availabilityRoute.js"
import wardRoute from "./Routers/wordRoutes.js"
import cookieParser from "cookie-parser";
import User from "./Models/userModel.js";


await connectDB();

const app = express();
dotenv.config();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET_KEy))


// routes/user.js
app.post("/user/quick-create", async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) return res.status(400).json({ message: "Required" });

  try {
    // If user already exists → re-use it
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, phone, role: "Patient" });
      await user.save();
      
    }
    res.status(201).json({ _id: user._id });
  } catch (error) {
    res.send(error.message);
    console.log(error);
  }
});




app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/inventory", inventoryRoute);
app.use("/medicine", medicineRoute);
app.use("/report", labReportRoute);
app.use("/bed", bedRoute)
app.use("/appointment", appointmentRoute);
app.use("/department", departMentRoute);
app.use("/records", recordRoute);
app.use("/staff", staffRoute)
app.use("/bills", billRoutes); //Bill related i too  help chatGpt , cause i don't know aggregate in mongodb , but soon  i will learn it 
app.use("/prescriptions", prescriptionRoutes);
app.use("/leave", leaveRoute);
app.use("/availability", availabilityRoute);
app.use("/ward" , wardRoute)



//ward/all
app.use((error, req, res, next) => {
  res.status(500).json({ error: error.message });
});

app.listen(4000, () => {
  console.log("server is running on port 4000");
});
