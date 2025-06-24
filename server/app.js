import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoute from "./Routers/authRoutes.js";
import userRoute from "./Routers/userRoutes.js";
import cookieParser from "cookie-parser";


await connectDB();

const app = express();
dotenv.config();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET_KEy))


app.get("/", async (req, res) => {

  res.send("server is running");
});

app.use("/auth", authRoute); //auth related  (login/ register , logout , otp )
app.use("/api", userRoute); // user profile related (get , update , delete)



app.listen(4000, () => {
  console.log("server is running on port 4000");
});
