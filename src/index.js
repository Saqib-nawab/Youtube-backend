// Importing the 'dotenv' package to load environment variables from a file
// This is commented out, so it's not active in the code, but could be used by uncommenting if needed
// require('dotenv').config({path: './env'})

import dotenv from "dotenv";

// Importing the 'connectDB' function from a file (presumed to be a database connection setup)
import connectDB from "./db/index.js";

// Importing the 'app' object from a file (presumed to be an Express.js application)
import { app } from "./app.js";

// Configuring environment variables using the 'dotenv' package by loading them from the specified file
dotenv.config({
  path: "./.env",
});

// Establishing a connection to the database using the 'connectDB' function and listening the app on port 8000
connectDB()
  .then(() => {
    // Once the database connection is successful, start the server on the specified port or default to 8000
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    // If there is an error connecting to the database, log an error message
    console.log("MONGO db connection failed !!! ", err);
  });
