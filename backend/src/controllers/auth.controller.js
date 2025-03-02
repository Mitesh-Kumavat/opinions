import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { ApiError } from "../utils/ApiError.js";

// Generate JWT Token
export const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" })
};

// Register User
export const register = async (req, res) => {
    const { fullName, email, password, profileImageUrl, username } = req.body;

    if (!fullName || !email || !password || !profileImageUrl || !username) {
        throw new ApiError(400, 'All fields are required');
    }

    // validation: check for username format
    if (!/^[a-zA-Z0-9-]+$/.test(username)) {
        throw new ApiError(400, 'Username can only contain Aplhanumeric characters and hyphens.');
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
        throw new ApiError(500, error.message || 'An error occurred while registering user');
    }
}