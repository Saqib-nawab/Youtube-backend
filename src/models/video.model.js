import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// Define the schema for videos
const videoSchema = new Schema(
  {
    // Fields for video information
    videoFile: {
      type: String, // Cloudinary URL
      required: true,
    },
    thumbnail: {
      type: String, // Cloudinary URL
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Apply the aggregate pagination plugin to the schema
videoSchema.plugin(mongooseAggregatePaginate);

// Create a Mongoose model for videos using the schema
export const Video = mongoose.model("Video", videoSchema);
