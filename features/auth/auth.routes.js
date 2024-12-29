import express from "express";
import { registerUser, loginUser, verifyOtp } from "./auth.controller.js";

const authorRoutes = express.Router();

authorRoutes.route("/register").post(registerUser);
authorRoutes.route("/login").post(loginUser);
authorRoutes.route("/verify-otp").post(verifyOtp);
export default authorRoutes;
