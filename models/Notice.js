import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    publishedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notice", noticeSchema);
