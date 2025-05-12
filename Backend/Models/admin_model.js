import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
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

export const Admin = mongoose.model("Admin", adminSchema);