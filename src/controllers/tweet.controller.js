import { Tweet } from "../models/tweet.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  try {
    const { content } = req.body;

    // Assuming you have user information available in the request, for example, through authentication middleware
    const owner = req.user._id; // who is tweeting

    const newTweet = new Tweet({
      content,
      owner,
    });

    const savedTweet = await newTweet.save();

    res.status(201).json(savedTweet);
  } catch (error) {
    // Handle any errors that occur during the tweet creation
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getUserTweets = asyncHandler(async (req, res) => {
  try {
    // Assuming you have user information available in the request, for example, through authentication middleware
    const userId = req.user._id; // tweets of a user

    const userTweets = await Tweet.find({ owner: userId });

    res.json(userTweets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const updateTweet = asyncHandler(async (req, res) => {
  try {
    const tweetId = req.params.id; //http://localhost:8000/api/v1/tweets/65b88f3cc1f61c9051eb466c req.params.id extracts this part from it "65b88f3cc1f61c9051eb466c"
    const { content } = req.body;

    const updatedTweet = await Tweet.findByIdAndUpdate(
      tweetId,
      { content },
      { new: true }
    );

    if (!updatedTweet) {
      throw new ApiError(404, "Tweet not found");
    }

    res.json(updatedTweet);
  } catch (error) {
    console.error(error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

const deleteTweet = asyncHandler(async (req, res) => {
  try {
    const tweetId = req.params.id;

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

    if (!deletedTweet) {
      throw new ApiError(404, "Tweet not found");
    }

    res.json({ message: "Tweet deleted successfully" });
  } catch (error) {
    console.error(error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
