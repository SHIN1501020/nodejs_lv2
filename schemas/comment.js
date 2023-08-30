import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now(),
    required: false,
  },
  postId: {
    type: String,
    required: true,
  },
});

//MongoDB에 저장되지 않은 속성
CommentSchema.virtual("commentId").get(function () {
  return this._id.toHexString();
});
CommentSchema.set("toJSON", {
  virtuals: true,
});

// 모델을 생성하여, 외부로 내보냅니다.
export default mongoose.model("Comment", CommentSchema);
