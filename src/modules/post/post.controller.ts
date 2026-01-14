import { NextFunction, Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelpers from "../../helpers/paginationSortingHelpers";
import { error } from "node:console";
import { UserRole } from "../../middleware/auth";
import { boolean } from "better-auth/*";

const createPost = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(400).json({
                error: "Unauthorized!",
            })
        }
        const result = await postService.createPost(req.body, user.id as string)
        res.status(201).json(result)
    } catch (e) {
        next(e)
    }
}


const getAllPost = async (req: Request, res: Response) => {
    try {
        const { search } = req.query
        const searchString = typeof search === 'string' ? search : undefined

        const tags = req.query.tags ? (req.query.tags as string).split(",") : [];


        // true or false
        const isFeatured = req.query.isFeatured
            ? req.query.isFeatured === 'true'
                ? true
                : req.query.isFeatured === 'false'
                    ? false
                    : undefined
            : undefined

        const status = req.query.status as PostStatus | undefined

        const authorId = req.query.authorId as string | undefined

        const {page,limit,skip,sortBy,sortOrder}= paginationSortingHelpers(req.query)

       

        const result = await postService.getAllPost({ search: searchString, tags, isFeatured, status, authorId ,page,limit,skip, sortBy,sortOrder})
        res.status(200).json(result)
    } catch (e) {
        
    }
}

const getPostById=async(req:Request,res:Response)=>{
    try{


        const {postId} = req.params;
        

        if(!postId){
            throw new Error("post id is required")

        }
        console.log({postId})
        const result = await postService.getPostById(postId)
                res.status(201).json(result)

    } catch(e){
        res.status(400).json({
            error: "Post creation failed",
            details: e
        })
        

    }
}



const getMyPosts= async(req:Request,res:Response)=>{
    try{
        
        const user= req.user
          console.log("user data :",user)
        
        
    

        if(!user){
            throw new Error(" you are unauthorized")
        }
        console.log("user data :",user)

        const result= await postService.getMyPosts(user.id);
        res.status(200).json(result)
        console.log("user data :",user)


    }catch(e){
        res.status(400).json({
            error:" post fetched failed",
            details:e

        })

    }
}



const updatePost= async(req:Request,res:Response,next:NextFunction)=>{
    try{
        
        const user= req.user

        

          console.log("user data :",user)
        
        
    

        if(!user){
            throw new Error(" you are unauthorized")
        }
        
        const isAdmin= user.role === UserRole.ADMIN
        console.log("user data :",user)

        const {postId}= req.params

        const result= await postService.updatePost(postId as string, req.body, user.id,isAdmin);
        res.status(200).json(result)
        console.log("user data :",user)


    }catch(e)
    {
        next()

    }
}



const deletepost=async(req:Request,res:Response)=>{
    try{
         const user= req.user
         if(!user){
            throw new Error("you are unauthorized")
         }

         const {postId}=req.params;
    const isAdmin = user.role === UserRole.ADMIN


         const result= await postService.deletepost(postId as string,user.id,isAdmin)
         res.status(200).json(result)

    }catch(e){
        const errorMessage=(e instanceof Error) ? e.message :"post deleted failed"
        res.status(400).json({
            error:errorMessage,
            details:e
        })

    }
}

  const getstats=async(req:Request,res:Response)=>{

    try{

        const result= await postService.getStats ();
        res.status(200).json(result)

    }catch(e){
        const errorMessage=( e instanceof Error) ? e.message: "stats  fetched failed"
        res.status(400).json({
            error:errorMessage,
            details:e
        })

    }

  }




export const PostController = {
    createPost,
    getAllPost,
    getPostById,
    getMyPosts,
    updatePost,
    deletepost,
    getstats
}