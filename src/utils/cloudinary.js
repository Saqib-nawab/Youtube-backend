import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; //it is a file system provided built in with nodejs

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//async await because uploading takes time
const uploadOnCloudinary = async (localFilePath) => {
  //because we are uploading file to cloudinary from local
  try {
    if (!localFilePath) return null; //incase if no local path is provided
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been uploaded successfull
    //console.log("file is uploaded on cloudinary ", response.url);
    fs.unlinkSync(localFilePath); //unlink is provided in fs it is used to delete the file after uploading successfully in order to overload disk operations
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

export { uploadOnCloudinary };
