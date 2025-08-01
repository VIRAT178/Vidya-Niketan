import { Course } from "../Models/course_model.js";
import { v2 as cloudinary } from "cloudinary";
import { Purchase } from "../Models/Purchase_model.js";

export const createCourse = async (req, res) => {
  const adminId = req.adminId;
  const { title, description, price } = req.body;
  console.log(title, description, price);

  try {
    if (!title || !description || !price) {
      return res.status(400).json({ errors: "All fields are required" });
    }
    const { image } = req.files;
    if (!req.files || !req.files.image) {
      return res.status(400).json({ errors: "No image file uploaded" });
    }

    const allowedFormat = ["image/png", "image/jpeg"];
    if (!allowedFormat.includes(image.mimetype)) {
      return res
        .status(400)
        .json({ errors: "Invalid file format. Only PNG and JPG are allowed" });
    }

    // claudinary code
    const cloud_response = await cloudinary.uploader.upload(
      image.tempFilePath,
      {
        folder: "courses",
        tags: [title],
      }
    );
    if (!cloud_response || cloud_response.error) {
      return res
        .status(400)
        .json({ errors: "Error uploading file to cloudinary" });
    }

    const courseData = {
      title,
      description,
      price,
      image: {
        public_id: cloud_response.public_id,
        url: cloud_response.url,
      },
      creatorId: adminId,
    };
    const course = await Course.create(courseData);
    res.json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating course" });
  }
};

export const updateCourse = async (req, res) => {
  const adminId = req.adminId;
  const { id } = req.params;
  const { title, description, price } = req.body;

  try {
    const courseSearch = await Course.findById(id);
    if (!courseSearch) {
      return res.status(404).json({ errors: "Course not found" });
    }

    if (!courseSearch.creatorId) {
      return res.status(403).json({ errors: "Course missing creator info" });
    }

    console.log("Course creator ID:", courseSearch.creatorId?.toString());
    console.log("Logged-in admin ID:", adminId);

    let imageData = courseSearch.image;

    if (req.files?.image) {
      const imageFile = req.files.image;
      const allowedFormat = ["image/png", "image/jpeg", "image/webp"];
      if (!allowedFormat.includes(imageFile.mimetype)) {
        return res.status(400).json({ errors: "Invalid file format" });
      }

      const cloudRes = await cloudinary.uploader.upload(
        imageFile.tempFilePath,
        {
          folder: "courses",
          tags: [title],
        }
      );

      imageData = {
        public_id: cloudRes.public_id,
        url: cloudRes.url,
      };
    }

    const updatedCourse = await Course.findOneAndUpdate(
      { _id: id, creatorId: adminId },
      { title, description, price, image: imageData },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(403).json({ errors: "Unauthorized update attempt" });
    }

    res
      .status(200)
      .json({ message: "Course updated successfully", course: updatedCourse });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ errors: "Internal server error during update" });
  }
};

export const deleteCourse = async (req, res) => {
  const adminId = req.adminId;
  const { id } = req.params;
  try {
    const course = await Course.findOneAndDelete({
      _id: id,
      creatorId: adminId,
    });
    if (!course) {
      return res
        .status(404)
        .json({ errors: "can't delete, created by other admin" });
    }
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ errors: "Error in course deleting" });
    console.log("Error in course deleting", error);
  }
};

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json({ success: true, count: courses.length, courses });
    console.log("Fetched courses:", courses);
  } catch (error) {
    res.status(500).json({ errors: "Error in getting courses" });
    console.log("error to get courses", error);
  }
};

export const getOneCourse = async (req, res) => {
  const { id } = req.params;
  console.log("Received courseId:", id);
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json({ course });
  } catch (error) {
    res.status(500).json({ errors: "Error in getting course details" });
    console.log("Error in course details", error);
  }
};

import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});
export const buyCourse = async (req, res) => {
  const { userId } = req;
  const { id: courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ errors: "Course not found" });
    }

    const existingPurchase = await Purchase.findOne({ userId, courseId });
    if (existingPurchase) {
      return res
        .status(400)
        .json({ errors: "User has already purchased this course" });
    }

    // stripe payment code goes here!!
    const amount = course.price;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.status(201).json({
      message: "Course purchased successfully",
      course,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ errors: "Error in course buying" });
    console.log("error in course buying ", error);
  }
};
