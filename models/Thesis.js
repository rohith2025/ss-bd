import mongoose from "mongoose";

const thesisSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    title: String,
    fileUrl: String,
  },
  { timestamps: true }
);

export default mongoose.model("Thesis", thesisSchema);
