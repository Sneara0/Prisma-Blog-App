import { Request, Response } from "express"
import { postService } from "./post.service"

const createPost = async (req: Request, res: Response) => {
   try{

    const result=await postService.createPost(req.body)
    res.status(201).json(result);


   }catch(err){
    res.status(400).json({
        Message:" failed to create post",
        details:err

    })

   }
}

export const postController = {
  createPost,
}
