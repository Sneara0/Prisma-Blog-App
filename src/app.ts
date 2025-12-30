import express from 'express';
import { postRouter } from './modules/post/post.router';
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';

const app=express();
app.use(express.json());
app.all('/api/auth/*splat', toNodeHandler(auth));
app.post('/posts',postRouter)
app.get("/", (req,res) => {
    res.json({
        message: "Hello World"

    })
})

export default app;