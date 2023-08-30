import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: false,
  },
  createAt: {
    type: Date,
    default: Date.now(),
    required: false,
  },
});

//MongoDB에 저장되지 않은 속성
PostSchema.virtual("postId").get(function () {
  return this._id.toHexString();
});
PostSchema.set("toJSON", {
  virtuals: true,
});

// 모델을 생성하여, 외부로 내보냅니다.
export default mongoose.model("Post", PostSchema);
