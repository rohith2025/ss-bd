import mongoose from "mongoose";

const homeworkSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    fileUrl: String,

    classDetails: {
      branch: String,
      year: String,
      section: String,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Homework", homeworkSchema);
