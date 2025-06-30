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
import cookieParser from "cookie-parser";
import upload from "./middleWare/multerMiddleware.js";
import { uploadImage } from "./services/cloudinaryServices.js";


await connectDB();

const app = express();
dotenv.config();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET_KEy))



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



app.use((error, req, res, next) => {
  res.status(500).json({ error: error.message });
});

app.listen(4000, () => {
  console.log("server is running on port 4000");
});
