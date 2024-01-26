// Import the Multer library(primarily used for multipart file uploads)
import multer from "multer";

// Configure storage settings for Multer(we are using disk storage settings)
const storage = multer.diskStorage({
  // Specify the destination directory where uploaded files will be stored
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  // Specify the filename for the uploaded file(we are using original filename)
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Create a Multer middleware instance with the configured storage
export const upload = multer({
  storage,
});
