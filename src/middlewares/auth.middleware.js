import ApiError from "../utils/ApiError";
import asyncHandler from "./asyncHandler";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized requiest");
        }
        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodeToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid token");
        }

        req.user = user;
        next();

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid token");
    }
})