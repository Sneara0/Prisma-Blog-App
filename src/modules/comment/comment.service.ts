import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createComment= async (payload:{
    content: string,
    authorId:string,
    postId:string,
    parentId:string
}) =>{




     await prisma.posts.findUniqueOrThrow({
        where:{
            id:payload.postId
        }
    })
    if(payload.parentId){
         await prisma.comment.findUniqueOrThrow({
            where:{
                id:payload.parentId
            }
        })

    }


return await prisma.comment.create({
    data: payload

})
   
};
const getCommentById=async(commentId:string)=>{
  return await prisma.comment.findUnique({
    where:{
        id:commentId
    },
    include:{
        post:{
   select:{
                id:true,
            title:true
   }
        }
    }
  })

}


const getCommentByAuthor= async (authorId:string)=>{
return await prisma.comment.findMany({
    where:{
        authorId
    },
    orderBy:{createdAt:"desc"},

    include:{
        post:{
            select:{
                id:true,
                title:true
            }
        }
    }
})
  

//nijer comment delete korte parbe
//login thakte hobe
//tar nijer comment kita seta check korte hobe

}
const deleteComment=async(comentId:string,authorId:string)=>{
   const commentData=await prisma.comment.findFirst({
    where:{
        id:comentId,
        authorId
    },
    select:{
        id:true
    }
    
   })
   if(!commentData){
    throw new Error("Your Provided input is invalid")
   }

    return await prisma.comment.delete({
    where:{
        id: commentData.id
    }
   })
}


// authorId,commentId,updatedData
const updateComment=async(commentId:string,data:{content:string,status:CommentStatus},authorId:string)=>{
  const commentData = await prisma.comment.findFirst({
    where:{
        id:commentId,
        authorId
    },
    select:{
        id:true
    },
    
  })

  if(!commentData){
    throw new Error("Your Provided input is invalid")
  }

  return await prisma.comment.update({
    where:{
        id:commentId,
        authorId
    },
    data
  })

}


const moderateComment=async(id:string,data:{status:CommentStatus})=>{
    
    const commentData= await prisma.comment.findUniqueOrThrow({
        where:{
            id
        },
        select:{
        id:true,
        status:true
    }
    });

    if(commentData.status===data.status){
        throw new Error(`Your provided status (${data.status}) is ready up to date`)
    }


    return await prisma.comment.update({
        where:{
            id
        },
        data
    })
}



export const commentService={
    createComment,
    getCommentById,
    getCommentByAuthor,
    deleteComment,
    updateComment,
    moderateComment
}