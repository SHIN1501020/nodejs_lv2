import express from "express";
import PostsRouter from "./posts.js";
import CommentsRouter from "./comments.js";

const router = express.Router();

//posts경로
router.use("/posts", [PostsRouter, CommentsRouter]);

export default router;