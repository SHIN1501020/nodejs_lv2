import express from "express";
import { prisma } from '../uttils/prisma/index.js';
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
  try {
    const { _postId } = req.params;
    await postIdSchema.validateAsync(_postId);
    const validation = await createCommentSchema.validateAsync(req.body);
    const { user, password, content } = validation;

    await prisma.comments.create({
      data: {
        postId: +_postId,
        user,
        password,
        content,
      }
    })

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
    
    const comments = await prisma.comments.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        commentId: true,
        user: true,
        content: true,
        createdAt: true
      }
    })

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

    const currentComment = await prisma.comments.findUnique({
      where: { commentId: +_commentId},
    })

    if (!currentComment) {
      return res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
    }

    if (currentComment.password === password) {
      await prisma.comments.update({
        data: { content },
        where: {
          commentId: +_commentId,
          password
        }
      })
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

    const currentComment = await prisma.comments.findFirst({
      where: { commentId: +_commentId }
    })

    if (!currentComment) {
      return res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
    }

    if (currentComment.password === password) {
      await prisma.comments.delete({ where: { commentId: +_commentId, password}})
    }

    return res.status(200).json({ message: "게시글을 삭제하였습니다." });
  } catch (err) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

export default router;
