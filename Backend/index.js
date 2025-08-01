import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from 'cors'

import { v2 as cloudinary } from "cloudinary";
import courseRoute from "./routes/course.route.js";
import usersRoute from "./routes/users.route.js"
import adminRoute from "./routes/admin.route.js"
import fileUpload from "express-fileupload";
import orderRoute from "../Backend/routes/order.route.js";


const app = express();
dotenv.config();

//middleware
app.use(express.json());
app.use(cookieParser())
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/"
}));
const allowedOrigins = [
  "https://vidya-niketan.vercel.app",
  "http://localhost:5173"
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.includes("vercel.app") || origin.includes("localhost")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));




const port = process.env.PORT || 3000;
const DB_URI = process.env.MONGO_URI;

try {
  await mongoose.connect(DB_URI);
  console.log("Connect to MongoDB");
} catch (error) {
  console.log(error);
}

//definig routes
app.use('/api/v1/course', courseRoute)
app.use('/api/v1/users', usersRoute)
app.use('/api/v1/admin',adminRoute)
app.use("/api/v1/order", orderRoute);


//cloudnry confrigution
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
