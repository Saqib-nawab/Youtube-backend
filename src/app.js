// Import necessary modules
import express from "express"; // Importing Express framework
import cors from "cors"; // Importing Cross-Origin Resource Sharing middleware
import cookieParser from "cookie-parser"; // Importing cookie parsing middleware

// Create an instance of the Express application
const app = express();

// Middleware for handling Cross-Origin Resource Sharing (CORS)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // Allow requests from the specified origin (configured via environment variable)
    credentials: true, // Allow credentials (e.g., cookies, HTTP authentication) to be sent with cross-origin requests
  })
);

// Middleware for parsing(data being recieved is presented in json formate) JSON requests with a size limit of 16kb
app.use(express.json({ limit: "16kb" }));

// Middleware for parsing URL-encoded requests with a size limit of 16kb
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Middleware for serving static files from the "public" directory
app.use(express.static("public"));

// Middleware for parsing cookies
app.use(cookieParser());

export { app };
