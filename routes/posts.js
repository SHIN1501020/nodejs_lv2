import express from "express";
import Post from "../schemas/post.js";
import Joi from "joi";

//joi 게시글 생성 유효성 검사
const createPostSchema = Joi.object({
  user: Joi.string().required(),
  password: Joi.string().required(),
  title: Joi.string().required(),
  content: Joi.string().required(),
});

const updatePostSchema = Joi.object({
  password: Joi.string().required(),
  title: Joi.string().required(),
  content: Joi.string().required(),
});

const postIdSchema = Joi.string().required();
const passwordSchema = Joi.string().required();

const router = express.Router();

//게시글 생성
router.post("/", async (req, res) => {
  //클라이언트에게 전달받은 데이터를 변수에 저장합니다.
  try {
    const validation = await createPostSchema.validateAsync(req.body);
    const { user, password, title, content } = validation;
    const post = new Post({ user, password, title, content });
    await post.save();
    return res.status(201).json({ message: "게시글을 생성하였습니다." });
  } catch (err) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

//전체 게시글 조회
router.get("/", async (req, res) => {
  //게시글을 createAt 내림차순 기준으로 정렬
  const posts = await Post.find().sort("-createAt").exec();
  return res.status(200).json({ data: posts });
});

//특정 게시글 조회
router.get("/:_postId", async (req, res) => {
  try {
    const { _postId } = req.params;
    await postIdSchema.validateAsync(_postId);

    const currentPost = await Post.findById(_postId).exec();
    if (!currentPost) {
      return res.status(404).json({ message: "게시글 조회에 실패하였습니다." });
    }
    return res.status(200).json({ data: currentPost });
  } catch (err) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

//게시글 수정
router.put("/:_postId", async (req, res) => {
  try {
    const { _postId } = req.params;
    await postIdSchema.validateAsync(_postId);
    const validation = await updatePostSchema.validateAsync(req.body);
    const { password, title, content } = validation;

    const currentPost = await Post.findById(_postId).exec();
    if (!currentPost) {
      return res.status(404).json({ message: "게시글 조회에 실패하였습니다." });
    }
    if (currentPost.password === password) {
      // currentPost.title = title;
      // currentPost.content = content;
      // await currentPost.save();
      await Post.findOneAndUpdate(
        { _id: _postId, password },
        { title, content },
        { new: true },
      ).exec();
    }
    return res.status(200).json({ message: "게시글을 수정하였습니다." });
  } catch (err) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

//게시글 삭제
router.delete("/:_postId", async (req, res) => {
  try {
    const { _postId } = req.params;
    await postIdSchema.validateAsync(_postId);
    const { password } = req.body;
    await passwordSchema.validateAsync(password);

    const currentPost = await Post.findById(_postId).exec();
    if (!currentPost) {
      return res.status(404).json({ message: "게시글 조회에 실패하였습니다." });
    }
    if (currentPost.password === password) {
      await Post.deleteOne({ _id: _postId });
    }
    return res.status(200).json({ message: "게시글을 삭제하였습니다." });
  } catch (err) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

export default router;
