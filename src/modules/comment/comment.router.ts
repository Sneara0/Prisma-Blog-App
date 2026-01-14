import express,{Router} from 'express'
import { CommentController } from './comment.controller'
import authMiddleware, { UserRole } from '../../middleware/auth'

const router = express.Router()


router.get("/author/:authorId",CommentController.getCommentByAuthor)

router.post("/",authMiddleware(UserRole.ADMIN,UserRole.USER) ,
    
    
    CommentController.createComment)

    router.get("/:comentId",CommentController.getCommentById)



    router.delete("/:commentId",
        authMiddleware(UserRole.ADMIN,UserRole.USER),CommentController.getCommentDelete)


            router.patch("/:commentId",
        authMiddleware(UserRole.ADMIN,UserRole.USER),CommentController.updateComment)

        router.patch("/:commentId/moderate",authMiddleware(UserRole.ADMIN),CommentController.moderateComment)




export const commentRouter: Router=router