import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router.route("/register").post(
  //that is where we are also uploading avatar and coveraImage along with the other informations for user
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
); //when the complete URL (http://localhost:8000/api/v1/users/register) is hit it will redirect it to the registering user
export default router;
