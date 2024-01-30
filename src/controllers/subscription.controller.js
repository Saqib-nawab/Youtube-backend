import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const { userId: subscriberId } = req.user; // Assuming user information is available through middleware

  // Check if the channelId is a valid ObjectId
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channelId");
  }

  // Check if the user is trying to subscribe/unsubscribe to their own channel
  if (channelId === subscriberId) {
    throw new ApiError(
      400,
      "User cannot subscribe/unsubscribe to their own channel"
    );
  }

  // Check if the user is already subscribed to the channel
  const existingSubscription = await Subscription.findOne({
    channelId,
    subscriberId,
  });

  if (existingSubscription) {
    // User is already subscribed, so unsubscribe
    await existingSubscription.remove();
    res.json({ message: "Unsubscribed successfully" });
  } else {
    // User is not subscribed, so subscribe
    const newSubscription = new Subscription({
      channelId,
      subscriberId,
    });

    await newSubscription.save();
    res.json({ message: "Subscribed successfully" });
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  // Check if the channelId is a valid ObjectId
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channelId");
  }

  // TODO: Implement logic to get subscribers of a channel
  const subscribers = await Subscription.find({ channelId }).populate(
    "subscriberId",
    "username"
  );
  res.json(subscribers);
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.user; // Assuming user information is available through middleware

  // TODO: Implement logic to get channels subscribed by the user
  const subscribedChannels = await Subscription.find({ subscriberId }).populate(
    "channelId",
    "username"
  );
  res.json(subscribedChannels);
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
