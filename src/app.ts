import express from 'express';
import { postRouter } from './modules/post/post.router';
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';
import cors from 'cors';
const app=express();


app.use (cors({
    origin:process.env.App_URL! || 'http://localhost:4000',
    credentials:true,

}))
app.use(express.json());
app.all('/api/auth/*splat', toNodeHandler(auth));
app.post('/posts',postRouter)
app.get("/", (req,res) => {
    res.json({
        message: "Hello World"

    })
})

export default app;