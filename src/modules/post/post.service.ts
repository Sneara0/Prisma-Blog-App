import { Posts } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost =async (data:Omit<Posts, 'id'|'createdAt' |'updatedAt'>)=>{
    const result =await prisma.posts.create({
        data
    }) 
    return result;

}
export const postService={
    createPost
}