import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import postsRoutes from "./routes/posts.route.js"
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js"
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());


app.use(postsRoutes);
app.use(userRoutes);

app.use(express.static("uploads"))


const start = async ()=>{
    const connectDb = await mongoose.connect(process.env.MONGO_URI);

    app.listen(9090,()=>{
        console.log("server is listening at 9090")
    }) 
}

start();