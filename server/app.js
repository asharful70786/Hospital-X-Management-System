import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import sendMail from "./services/sendMailServices.js";


await connectDB();

const app = express();


app.get("/", async (req, res) => {
  await sendMail("ashrafulmomin2@gmail.com");
  res.send("server is running");
});




app.listen(3000, () => {
  console.log("server is running on port 3000");
});
