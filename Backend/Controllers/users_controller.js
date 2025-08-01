import { User } from "../Models/users_model.js";
import bcrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { Purchase } from "../Models/Purchase_model.js";
import { Course } from "../Models/course_model.js";

export const signup = async (req, res) => {
  const userSchema = z.object({
    firstName: z
      .string()
      .min(2, { message: "First name must be atleast 2 char long" })
      .max(50, { message: "Last name must be atmost 50 char long" }),
    lastName: z
      .string()
      .min(2, { message: "Last name must be atleast 2 char long" })
      .max(50, { message: "Last name must be atleast 50 char long" }),
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "Password must be atleast 8 char long" })
      .max(25, { message: "Password must be atleast 25 char long" }),
  });

  const validateData = userSchema.safeParse(req.body);
  if (!validateData.success) {
    return res
      .status(400)
      .json({ errors: validateData.error.issues.map((err) => err.message) });
  }
  const { firstName, lastName, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const existuser = await User.findOne({ email: email });
    if (existuser) {
      return res.status(400).json({ errors: "user is already exists" });
    }
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "sign up seccussed", newUser });
  } catch (error) {
    res.status(500).json({ errors: "Can't sign the user" });
    console.log("Error in signup", error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    const isPassword = bcrypt.compare(password, user.password);

    //jwt code
    const token = jwt.sign({ id: user._id }, process.env.JWT_USER_PASSWORD, {
      expiresIn: "1d",
    });

    if (!user || !isPassword) {
      return res.status(403).json({ errors: "invalid credentials" });
    }
    res.cookie("jwt", token);
    res.status(201).json({ message: "Login Successful", user, token });
  } catch (error) {
    res.status(500).json({ errors: "Error in login" });
    console.log("Error in login", error);
  }
};

export const logout = async (req, res) => {
  try {
    if (!req.cookies.jwt) {
      return res.status(401).json({ errors: "Kindly login firstly" });
    }
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logged Out Successfully" });
  } catch (error) {
    console.log("Error in Log out", error);
  }
};

export const purchased = async (req, res) => {
  const userId = req.userId;
  try {
    const purchase = await Purchase.find({ userId });
    let purchasedCourseId = [];
    for (let i = 0; i < purchase.length; i++) {
      purchasedCourseId.push(purchase[i].courseId);
    }
    const courseData = await Course.find({
      _id: { $in: purchasedCourseId },
    });
    res.status(200).json({ purchase, courseData });
  } catch (error) {
    console.log("Error in getting course", error);
  }
};
