import express from "express";
import {
  createMessage,
  getMessages,
  deleteMessage,
} from "./message.controller.js";
import upload from "../../middlewares/multerConfig.js";
import { verifyToken } from "../../middlewares/AuthMiddleware.js";

const messageRoutes = express.Router();

messageRoutes
  .route("/")
  .post(verifyToken, upload.single("image"), createMessage)
  .get(verifyToken, getMessages);
messageRoutes.route("/:id").delete(verifyToken, deleteMessage);
export default messageRoutes;
