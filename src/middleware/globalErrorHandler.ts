import { NextFunction, Request, Response } from "express"
import { Prisma } from "../../generated/prisma/client"

function errorHandler (err:any, req:Request, res:Response, next:NextFunction) {
  



  let statusCode = 500;
  let errMessage = "Internal Server Error";
  let  errDetails = err;
   
   
   
    //PrismaClientValidationError
    if( err instanceof Prisma.PrismaClientValidationError){
      statusCode=400;
      errMessage= "You provide incorrect field type or missing fields"
    }


    //PrismaClientKnownRequestError
 else if (err instanceof Prisma.PrismaClientKnownRequestError) {
  if(err.code ==="P2025"){
    statusCode=400;
    errMessage="An operation failed because it depends on one or more records that were required but not found. {cause}"
  }
  else if(err.code===" P2002"){
    statusCode=400;
   errMessage=" Duplicate key error"

  }
  else if(err.code ==='P2003'){
    statusCode=400;
    errMessage="Foreign key constraints  failed"


  }
  else if( err instanceof Prisma.PrismaClientUnknownRequestError){
    statusCode=500;
     errMessage="Error occured during  query execution"



  }
  else if(err instanceof Prisma.PrismaClientInitializationError){
    if(err.code==="P1000"){
      statusCode=401
      errMessage="Authenticatio failed.Please check your credentials"
    }

  }
  else if (err.code==="P1001"){
    statusCode=400;
    errMessage="Can't reach database server"

  }

 

 }

 


  res.status(500)
  res.json({

    



    message:"Error from error handler",
    error:err
  })
}
export default errorHandler
