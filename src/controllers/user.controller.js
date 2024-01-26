import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//this is where we are registering a user
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
    //if user with the same email or username already exists then throw an error (waited becuase it takes time to check again)
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  //console.log(req.files);

  const avatarLocalPath = req.files?.avatar[0]?.path; //uploadoncloudnary takes a path for the avatar
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
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

export { registerUser };
