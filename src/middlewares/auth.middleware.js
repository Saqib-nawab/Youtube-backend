//before doing anything to user like logging out, uploading vidoes or something we first need to authenticate using this middleware.
//this authentication middleware is going to be used multiple times before user performs any functionality

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  //if the user has json web token it means he's verified
  try {
    const token =
      req.cookies?.accessToken || //we can validate user whether he has cookies and also if he's using mobile application then we cn also validate using header
      req.header("Authorization")?.replace("Bearer ", "");

    // console.log(token);
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); //to verify token and the previous token

    const user = await User.findById(decodedToken?._id).select(
      //we are not going to send him password and refresh token becuase then authorization would makes no sense
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next(); //move to next middleware (middlewares usually have next)
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
