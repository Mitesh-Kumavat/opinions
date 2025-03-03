import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// This middleware(protect) is used to protect routes that require authentication. It checks if the token is present in the request headers, verifies the token, and attaches the user object to the request object. If the token is not present or invalid, it throws an error. The user object is then available in the request object for further processing in the route handler.
export const protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json(new ApiResponse(401, "Unauthorized Request", "Invalid Request."))
    }

    try {
        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        let user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            throw new ApiError(404, "User not found")
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json(new ApiResponse(401, "Unauthorized Request", error?.message || "Invalid Token"))
    }
}