
import { prisma } from "../lib/prisma";
import { UserRole } from "../middleware/auth";


async function seeAdmin(){
    try{

        const adminData={
            name:"Admin User 1",
            email:"admin@example1.com",
            role:UserRole.ADMIN,
            password:"Admin123",
            emailVerified:true

        }




        const exitingUser= await prisma.user.findUnique({
            where:{
                email:adminData.email

            }
        });
        if(exitingUser){
            throw new Error("Admin user already exists");
        }
        const signUpAdmin=await fetch("http://localhost:5000/api/auth/sign-up/email",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(
              adminData )
        })
        if(signUpAdmin.ok){
            console.log("Admin user created successfully");
            await prisma.user.update({
                where:{
                    email:adminData.email
                },
                data:{
                    emailVerified:true,
                }
            })
            console.log("Admin  email verified succesfully")
        }
        console.log("*** success****")
        


    }catch(err){
        console.log(err);

    }
}
seeAdmin();