import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true // this is for enhanching the searching functionality of mongoDB
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    profileImageUrl: {
        type: String, //Cloudinary URL for storing url of avatar
        required: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    bookmarkedPolls: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Poll"
    }],
},
    { timestamps: true })

// run this before saving the user...
userSchema.pre('save', async function (next) {
    if (this.isModified("password")) {
        this.password = bcrypt.hash(this.password, 10)
    }
    next();
})


// We have added this methods for User schmea so now when we create any user so we can access this methods from User.method() 
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}



export const User = mongoose.model("User", userSchema);