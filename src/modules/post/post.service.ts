import { CommentStatus, Posts, PostStatus } from "../../../generated/prisma/client";
import { PostsWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createPost = async (data: Omit<Posts, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>, userId: string) => {
    const result = await prisma.posts.create({
        data: {
            ...data,
            authorId: userId
        }
    })
    return result;
}

const getAllPost = async ({
    search,
    tags,
    isFeatured,
    status,
    authorId,
    page,
    limit,
    skip,
    sortBy,
    sortOrder
}: {
    search: string | undefined,
    tags: string[] | [],
    isFeatured: boolean | undefined,
    status: PostStatus | undefined,
    authorId: string | undefined
    page: number,
    limit: number,
    skip: number,
    sortBy: string 
    sortOrder: string 

}) => {
    const andConditions: PostsWhereInput[] = []

    if (search) {
        andConditions.push({
            OR: [
                {
                    title: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    content: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    tags: {
                        has: search
                    }
                }
            ]
        })
    }

    if (tags.length > 0) {
        andConditions.push({
            tags: {
                hasEvery: tags as string[]
            }
        })
    }

    if (typeof isFeatured === 'boolean') {
        andConditions.push({
            isFeatured
        })
    }

    if (status) {
        andConditions.push({
            status
        })
    }

    if (authorId) {
        andConditions.push({
            authorId
        })
    }

    const allPost = await prisma.posts.findMany({
        take: limit,
        skip:skip,
        where: {
            AND: andConditions
        },





        orderBy:  {
            [sortBy]: sortOrder
        },
        include:{
            _count:{
                select:{comments:true}
            }
        }

    


    });


const total = await prisma.posts.count({

    where: {
            AND: andConditions
        }



})

    return {
        data: allPost,
        pagination:{
            total,
            page,
            limit,
            totalPages:Math.ceil(total/limit)
        }
    };
}


const getPostById= async (postId:string)=>{
 return await prisma.$transaction(async(tx)=>{
    
    await tx.posts.update({
    where:{
        id:postId
    },
    data:{
        views:{
            increment:1
        }
    }


  })





   const postData= await tx.posts.findUnique({
    where:{
        id:postId
    },
    include:{
        comments:{
           where:{
             parentId:null,
             status:CommentStatus.APPROVED
           },
         orderBy: [
  {
    createdAt: "desc",
  },
],

           include:{
              replies:{

              where:{
                status:CommentStatus.APPROVED

              },
              orderBy:{createdAt:"asc"},


                include:{
                    replies:{
                        where:{
                            status:CommentStatus.APPROVED
                        },
                        orderBy:{createdAt:"asc"},
                    }
                }
              }
           }


        },
        _count:{
            select:{comments:true}
        }


    }
   })

   return postData
})

}

const getMyPosts=async(authorId:string)=>{

  await prisma.user.findUnique({
    where:{
        id:authorId,
        status:"ACTIVE"
    },
    select:{
        id:true
    }
  })


    const result=await prisma.posts.findMany({
        where:{
            authorId
        },
        orderBy:{
            createdAt:"desc"
        },


        include:{
            _count:{
                select:{
                    comments:true
                }
            }

        }
        
    });
    const total= await prisma.posts.aggregate({
        _count:{
            id:true
        },

        where:{
            authorId
        }
    })



    return {
        data:result,
        total
    }
}





// user-only nijer post update korte parbe,isFeatured update korte parbe na.
//admin-sobar post update  korte parbe. 



const updatePost= async(postId:string, data:Partial<Posts>,authorId:string,isAdmin:boolean)=>{
   const postData= await prisma.posts.findUniqueOrThrow({
    where:{
        id:postId
    },
    select:{
        id:true,
        authorId:true
    }
   })

   if(!isAdmin &&(postData.authorId !== authorId)){
    throw new Error("you are not the owner/creator at this post")
   }

   if(!isAdmin){
    delete data.isFeatured

   }

   const result= await prisma.posts.update({
    where:{
        id:postData.id
    },
    data
   })

   return result
}

// user nijer post delete korte parbe
//admin sobar post delete korte parbe.

const deletepost=async(postId:string,authorId:string,isAdmin:boolean)=>{

    const postData= await prisma.posts.findFirstOrThrow({
        where:{
            id:postId
        },
        select:{
            id:true,
            authorId:true
        }
        
    })

    if(!isAdmin &&(postData.authorId !==authorId)){
        throw new Error("you are not the owner/creator of the post")
    }


    return await prisma.posts.delete({
        where:{
            id:postId
        }
    })


}


const getStats = async () => {
  return await prisma.$transaction(async (tx) => {

    const [
      totalPost,
      publishedPost,
      draftPost,
      archivedPost,
      totalComments,
      approvedComments,
      rejectedComments,
      totalUsers,
      adminCount,
      userCount,
      totalViewsAgg,
    ] = await Promise.all([
      tx.posts.count(),

      tx.posts.count({
        where: { status: PostStatus.PUBLISHED },
      }),

      tx.posts.count({
        where: { status: PostStatus.DRAFT },
      }),

      tx.posts.count({
        where: { status: PostStatus.ARCHIVED },
      }),

      tx.comment.count(),

      tx.comment.count({
        where: { status: CommentStatus.APPROVED },
      }),

      tx.comment.count({
        where: { status: CommentStatus.REJECT },
      }),

      tx.user.count(),

      tx.user.count({
        where: { role: "ADMIN" },
      }),

      tx.user.count({
        where: { role: "USER" },
      }),

      tx.posts.aggregate({
        _sum: { views: true },
      }),
    ]);

    return {
      totalPost,
      publishedPost,
      draftPost,
      archivedPost,
      totalComments,
      approvedComments,
      rejectedComments,
      totalUsers,
      adminCount,
      userCount,
      totalViews: totalViewsAgg._sum.views ?? 0,
    };
  });
};


export const postService = {
    createPost,
    getAllPost,
    getPostById,
    getMyPosts,
    updatePost,
    deletepost,
    getStats 
}