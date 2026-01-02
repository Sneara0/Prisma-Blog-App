import express, { NextFunction, Request, Response } from "express";
import { postController } from "./post.controller";

import authMiddleware, { UserRole } from "../../middleware/auth";

const router = express.Router();




router.post(
  "/",
  authMiddleware(UserRole.USER),
  postController.createPost
);

export const postRouter = router;
