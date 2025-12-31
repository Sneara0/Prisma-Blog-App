import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";



const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.App_User!,
    pass: process.env.App_Pass!,
  },
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", 
    }),
    trustedOrigins:[process.env.App_URL!],
    user: {
      additionalFields:{
        role:{
          type: "string",
          defaultValue:"USER",
          required:true,
        },
        phone:{
          type: "string",
          required: false,
        },
        status:{
          type: "string",
          defaultValue: "ACTIVE",
          required: false,
        }

      }

    },
    emailAndPassword: { 
    enabled: true,
    autoSignIn:false,
    requireEmailVerification:true, 
  }, 

    emailVerification: {
    sendVerificationEmail: async ( { user, url, token }, request) => {
      console.log({user,url,token})

      const info = await transporter.sendMail({
    from: '"prisma blog" <snearaparvin.cseph@gmail.com>',
    to: "snearaparvin.cse1@gmail.com",
    subject: "Hello ✔",
    text: "Hello world?", // Plain-text version of the message
    html: "<b>Hello world?</b>", // HTML version of the message
  });

  console.log("Message sent:", info.messageId);
   
    }, 
  },
});