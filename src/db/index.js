import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

//we are creating a new variable here which will be used in the outer index.js file to access database
//async await is used because sometimes it takes some time to establish a connection to the database
//try catch is used incase the connection to the database fails
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

export default connectDB;
