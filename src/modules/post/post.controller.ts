import { Request, Response } from "express"
import { postService } from "./post.service"

const createPost = async (req: Request, res: Response) => {
   try{

    const user = req.user as any
   if(!user){
     return  res.status(401).json({
      message:"Unauthorized"
    })
   }

    const result=await postService.createPost(req.body,user.id as  string)
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
