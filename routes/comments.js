import express from "express";
import Comment from "../schemas/comment.js";
import Joi from "joi";

//joi 게시글 생성 유효성 검사
const createCommentSchema = Joi.object({
  user: Joi.string().required(),
  password: Joi.string().required(),
  content: Joi.string().min(1).required(),
});

const updateCommentSchema = Joi.object({
  password: Joi.string().required(),
  content: Joi.string().required(),
});

const postIdSchema = Joi.string().required();
const passwordSchema = Joi.string().required();
const CommentSchema = Joi.string().required();

const router = express.Router();

//댓글 생성
router.post("/:_postId/comments", async (req, res) => {
  //클라이언트에게 전달받은 데이터를 변수에 저장합니다.
  try {
    const { _postId } = req.params;
    await postIdSchema.validateAsync(_postId);
    const validation = await createCommentSchema.validateAsync(req.body);
    const { user, password, content } = validation;

    const comment = new Comment({ user, password, content, postId: _postId });
    await comment.save();

    return res.status(201).json({ message: "댓글을 생성하였습니다." });
  } catch (err) {
    if (err.message === '"content" is not allowed to be empty') {
      return res.status(400).json({ message: "댓글 내용을 입력해주세요." });
    }
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

//댓글 조회
router.get("/:_postId/comments", async (req, res) => {
  try {
    const { _postId } = req.params;
    await postIdSchema.validateAsync(_postId);
    const comments = await Comment.find({ postId: _postId })
      .sort("-createAt")
      .exec();

    return res.status(200).json({ data: comments });
  } catch (err) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

//댓글 수정
router.put("/:_postId/:_commentId", async (req, res) => {
  try {
    const { _postId, _commentId } = req.params;
    await postIdSchema.validateAsync(_postId);
    await CommentSchema.validateAsync(_commentId);

    const validation = await updateCommentSchema.validateAsync(req.body);
    const { password, content } = validation;

    const currentComment = await Comment.findById(_commentId).exec();

    if (!currentComment) {
      return res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
    }

    if (currentComment.password === password) {
      // currentComment.content = content;
      // await currentComment.save()
      await Comment.findOneAndUpdate(
        { _id: _commentId, password },
        { content },
      ).exec();
    }

    return res.status(200).json({ message: "댓글을 수정하였습니다." });
  } catch (err) {
    if (err.message === '"content" is not allowed to be empty') {
      return res.status(400).json({ message: "댓글 내용을 입력해주세요." });
    }
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

//댓글 삭제
router.delete("/:_postId/:_commentId", async (req, res) => {
  try {
    const { _postId, _commentId } = req.params;
    const { password } = req.body;

    await postIdSchema.validateAsync(_postId);
    await CommentSchema.validateAsync(_commentId);
    await passwordSchema.validateAsync(password);

    const currentComment = await Comment.findById(_commentId).exec();

    if (!currentComment) {
      return res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
    }

    if (currentComment.password === password) {
      await Comment.deleteOne({ _id: _commentId });
    }

    return res.status(200).json({ message: "게시글을 삭제하였습니다." });
  } catch (err) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

export default router;
