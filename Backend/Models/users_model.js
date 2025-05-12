import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
    },
    lastName : {
        type : String,
    },
    email : {
        type : String,
        union: true,
    },
    password : {
        type : String,
    }
})

export const User = mongoose.model("User", userSchema);