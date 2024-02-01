import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query; //In Node.js, req.query is an object containing the parsed query parameters from the URL

  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError("Validation error", 400, errors.array());
  }

  // Upload video file to Cloudinary
  const videoFileUrl = await uploadOnCloudinary(req.files.video[0].path);

  // Upload thumbnail to Cloudinary
  const thumbnailUrl = await uploadOnCloudinary(req.files.thumbnail[0].path);

  // Create video document in MongoDB
  const video = await Video.create({
    videoFile: videoFileUrl,
    thumbnail: thumbnailUrl,
    title,
    description,
    duration: 0, // You might want to get the actual duration of the video
    owner: req.user._id, // Assuming you have user information in req.user
  });

  return res.json(new ApiResponse("Video published successfully", video));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
