import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { Poll } from '../models/poll.model.js';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

// Generate JWT Token
export const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "30d" })
};

// Register User
export const register = async (req, res) => {
    const { fullName, email, password, profileImageUrl, username } = req.body;

    if (!fullName || !email || !password || !profileImageUrl || !username) {
        return res.status(400).json(new ApiResponse(400,
            {
                fullName,
                email,
                password,
                profileImageUrl,
                username
            }, 'All fields are required'));
    }

    // validation: check for username format
    if (!/^[a-zA-Z0-9-]+$/.test(username)) {
        return res.status(400).json(new ApiResponse(400, username, 'Username can only contain Aplhanumeric characters and hyphens.'));
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ApiError(400, 'User with this email already exists');
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            throw new ApiError(400, 'Username already exists');
        }

        const user = await User.create({
            fullName,
            email,
            password,
            profileImageUrl,
            username
        })

        res.status(201).json({
            _id: user._id,
            user,
            token: generateToken(user._id)
        });


    } catch (error) {
        return res.status(error?.statusCode || 500).json(new ApiResponse(error?.statusCode || 500, error, error.message || 'Internal Server Error'));
    }
}

// Login User
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {

        if (!email || !password) {
            throw new ApiError(400, 'Email and Password are required');
        }

        const user = await User.findOne({ email })

        if (!user || !(await user.comparePassword(password))) {
            throw new ApiError(401, "Invalid email or password.")
        }

        const totalPollsCreated = await Poll.countDocuments({ creator: user._id });
        const totalPollsVotes = await Poll.countDocuments({ voters: user._id });
        const totalPollsBookmarked = user.bookmarkedPolls.length;

        const response = new Object({
            user: {
                ...user.toObject(),
                totalPollsVotes: totalPollsVotes || 0,
                totalPollsCreated: totalPollsCreated || 0,
                totalPollsBookmarked: totalPollsBookmarked || 0,
            },
            token: generateToken(user._id)
        })
        return res.status(200).json(new ApiResponse(200, response, "login successfull"))

    } catch (error) {
        return res.status(error?.statusCode || 500).json(new ApiResponse(error?.statusCode || 500, error, error.message || 'Internal Server Error'));
    }
}

// Get User Profile
export const getUserInfo = async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    if (user) {

        const totalPollsCreated = await Poll.countDocuments({ creator: user._id });
        const totalPollsVotes = await Poll.countDocuments({ voters: user._id });
        const totalPollsBookmarked = user.bookmarkedPolls.length;

        const response = new Object({
            ...user.toObject(),
            totalPollsVotes: totalPollsVotes || 0,
            totalPollsCreated: totalPollsCreated || 0,
            totalPollsBookmarked: totalPollsBookmarked || 0,
        })
        return res.json(new ApiResponse(200, response, 'User found'));
    } else {
        return res.status(404).json(new ApiResponse(404, "", 'User not found'));
    }
}

export const uploadImage = async (req, res) => {
    const localFilePath = req.file?.path;
    console.log(localFilePath);


    if (!localFilePath) {
        return res.status(400).json(new ApiResponse(400, "", "No file Uploaded"))
    }

    const image = await uploadOnCloudinary(localFilePath)

    if (!image) {
        return res.status(500).json(new ApiResponse(500, "Error", "Internal Server Error while uploading the image"))
    }

    return res.status(200).json(new ApiResponse(200, image, "Image Uploaded successfully"))
}