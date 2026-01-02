import { Posts } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost =async (data:Omit<Posts, 'id'|'createdAt' |'updatedAt'|'authorId'>,userId:string)=>{
    const result =await prisma.posts.create({
        data: {
            ...data,
            authorId: userId
        }
    })
    return result;

}
export const postService={
    createPost
}