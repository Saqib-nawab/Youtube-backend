import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

//generating access and refresh tokens for the logged in user
const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId); //finding user
    const accessToken = user.generateAccessToken(); //from user creating AccessToken
    const refreshToken = user.generateRefreshToken(); //from user creating RefreshToken

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); //validation not required before saving

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

//this is where we register a user
const registerUser = asyncHandler(async (req, res) => {
  //steps to register user
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { fullName, email, username, password } = req.body;
  //console.log("email: ", email);

  if (
    //validating if any of the following is empty or not
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required"); //throw an erro if any one is empty
  }

  const existedUser = await User.findOne({
    // user with capital U is a mogoose model and it provides these functions like findOne (remember)
    //if user with the same email or username already exists then throw an error (waited becuase it takes time to check again)
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  //console.log(req.files);

  const avatarLocalPath = req.files?.avatar[0]?.path; //uploadoncloudnary takes a path for the avatar
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath; //incase if coverImage is missing then make it empty(not unde)
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required"); //incase user misses avatar(picture)
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath); //uploading avatar to cloudinary
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required"); //if avatar does not exist
  }

  const user = await User.create({
    //creating an object of the user created
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "", //if cover image is missing then keep it emtpy
    email,
    password,
    username: username.toLowerCase(), //becuase username is condtioned to be lowercase
  });

  const createdUser = await User.findById(user._id).select(
    //if user is successfully created and has an id ...
    "-password -refreshToken"
  );

  if (!createdUser) {
    //if user is not created
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res //return response if user is successfully registered
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  //steps to login user
  // req body -> data
  // username or email
  //find the user
  //password check
  //access and referesh token
  //send cookie

  const { email, username, password } = req.body; //taking user information
  // console.log(email);

  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }

  // Here is an alternative of above code based on logic discussed in video:
  // if (!(username || email)) {
  //     throw new ApiError(400, "username or email is required")

  // }

  const user = await User.findOne({
    //if user with this username and email exists
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  //validating password using isPasswordCorrect method in user model
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    //destructuring tokens of the user Id created using the function generateAccessAndRefereshTokens
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    //
    "-password -refreshToken" //these information should not be sent to user
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res //returing response object
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

//logging out user
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

export { registerUser, loginUser, logoutUser };
