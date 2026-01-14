import { Request, Response } from "express";
import { commentService } from "./comment.service";
import strict from "node:assert/strict";
import { error } from "node:console";



const createComment= async(req:Request,res:Response) =>{
    try{

        const user= req.user;
        req.body.authorId= user?.id;

        const result=await commentService.createComment(req.body)
        res.status(201).json(result)

    } catch(e){
        res.status (400).json({
            error:"comment creation failed",
            details:e
        })

    }
}


const getCommentById= async(req:Request,res:Response)=>{
    try{

        const {commentId}=req.params
        const result= await commentService.getCommentById(commentId as string)
        res.status(200).json(result)

    }catch(e){
        res.status(400).json({
            error:"comment fetched failed",
            detailes:e
        })

    }
}


const getCommentByAuthor= async(req:Request,res:Response)=>{
    try{
        const {authorId}= req.params
        const result=await commentService.getCommentByAuthor(authorId as string)
        res.status(200).json(result)

    }catch(e){
        res.status(400).json({
            error:"comment fetched failed ",
            details:e
        })

    }
}

const getCommentDelete=async(req:Request,res:Response)=>{
    try{
        const user= req.user

        const {comentId}= req.params
        const result=await commentService.deleteComment(comentId as string ,user?.id as string)
        res.status(200).json(result)

    }catch(e){
        res.status(400).json({
            error:"comment delete failed ",
            details:e
        })

    }
}

const updateComment= async(req:Request,res:Response)=>{

 try{
    const user= req.user
    const {comentId}=req.params
    const result= await commentService.updateComment(comentId as string,req.body,user?.id as string)
    res.status(200).json(result)

 }catch(e){
    console.log(e)
    res.status(400).json({
        error:"comment update failed",
        details:e
    })

 }



}

const moderateComment=async(req:Request,res:Response)=>{
    try{

        const {commentId}= req.params
        const result= await commentService.moderateComment(commentId as string,req.body)
        res.status(200).json(result)

    }catch(e){

        const errorMessage= (e instanceof Error) ? e.message:"comment update failed"
        
     
        res.status(400).json({
            error:"comment update failed",
            details: errorMessage
        })

    }
}





export const CommentController={
    createComment,
    getCommentById,
    getCommentByAuthor,
    getCommentDelete,
    updateComment,
    moderateComment
    
}