import express, { Router } from 'express';
import { PostController } from './post.controller';
import auth, { UserRole } from '../../middleware/auth';

const router = express.Router();

router.get(
    "/",
    PostController.getAllPost
)

router.get(
    "/stats",
    auth(UserRole.ADMIN),
    PostController.getstats
)

router.get("/my-posts", auth(UserRole.ADMIN,UserRole.USER) ,PostController.getMyPosts)

router.get("/:id",PostController.getPostById)

router.post(
    "/",
    auth(UserRole.USER),
    PostController.createPost
)


router.patch("/:postId",auth(UserRole.ADMIN,UserRole.USER),PostController.updatePost)

router.delete("/:postId",auth(UserRole.ADMIN,UserRole.USER),PostController.deletepost)

export const postRouter: Router = router;