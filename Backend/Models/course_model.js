import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  image: {
     public_id:{
      type: String
     },
     url:{
      type:String
     }
  },
  creatorId:{
    type : mongoose.Types.ObjectId,
    ref : "user",
  }
});

export const Course = mongoose.model("Course", courseSchema, "courses");
