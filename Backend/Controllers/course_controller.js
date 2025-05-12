import { Course } from "../Models/course_model.js";
import { v2 as cloudinary } from "cloudinary";
import { Purchase } from "../Models/Purchase_model.js";

export const createCourse = async (req, res) => {
  const adminId = req.adminId;
  const { title, description, price } = req.body;

  try {
    if (!title || !description || !price) {
      return res.status(400).json({ errors: "All Fields are required" });
    }
    const image = req.files.image;
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ errors: "the file uploaded" });
    }
    // console.log(req.files)
    const allowedFormat = ["image/png", "image/jpeg", "image/webp"];

    if (!allowedFormat.includes(image.mimetype)) {
      return res
        .status(400)
        .json({ errors: "Only jpeg and png type are allowed" });
    }
    // Cloudnary code
    const cloud_response = await cloudinary.uploader.upload(image.tempFilePath);
    if (!cloud_response || cloud_response.error) {
      return res
        .status(400)
        .json({ errors: "Error uploading file in cloudnary" });
    }

    const courseData = {
      title,
      description,
      price,
      image: {
        public_id: cloud_response.public_id,
        url: cloud_response.url,
      },
      createrId: adminId,
    };
    const course = await Course.create(courseData);
    res.json({
      message: "cousre created successfully",
      course,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: "error in creating cousrse" });
  }
};

export const updateCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  const { title, description, price, image } = req.body;
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      {
        _id: courseId,
        createrId: adminId,
      },
      {
        title,
        description,
        price,
        image: {
          public_id: image?.public_id,
          url: image?.url,
        },
      },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }

    res
      .status(200)
      .json({ message: "Course updated successfully", updatedCourse });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ errors: "Course update failed" });
  }
};

export const deleteCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  try {
    const course = await Course.findOneAndDelete({
      _id: courseId,
      createrId: adminId,
    });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json({ message: " Course deleted Successfully" });
  } catch (error) {
    res.status(500).json({ errors: "Error in course deleting" });
    console.log("Error in course Deleting", error);
  }
};

export const getallCourse = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(201).json({ courses });
  } catch (error) {
    res.status(500).json({ errors: " Can't get courses" });
    console.log("Error in getting Course", error);
  }
};

export const getCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found!" });
    }
    res.status(200).json({ course });
  } catch (error) {
    res.status(500).json({ errors: "Can't get the course" });
    console.log("Error in get Course", error);
  }
};
import Stripe from "stripe";
import config from "../config.js"; 

const stripe = new Stripe(config.STRIPE_SECRET_KEY);

export const buyCourse = async (req, res) => {
  const { userId } = req;
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found!" });
    }

    const existingPurchase = await Purchase.findOne({ userId, courseId });
    if (existingPurchase) {
      return res
        .status(400)
        .json({ error: "User already purchased this course" });
    }

    const amount = course.price * 100; 
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    const newPurchase = new Purchase({ userId, courseId });
    await newPurchase.save();

    return res.status(200).json({
      message: "Payment intent created successfully",
      course,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error in buying course:", error);
    return res.status(500).json({ errors: "Error in course buying" });
  }
};
