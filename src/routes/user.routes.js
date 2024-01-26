import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router();
router.route("/register").post(registerUser); //when the complete URL (http://localhost:8000/api/v1/users/register) is hit it will redirect it to the registering user
export default router;
