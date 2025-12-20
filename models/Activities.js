import mongoose from "mongoose";

const activitiesSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    title: String,
    type: String,
    description: String,
    date: Date,
    certificateUrl: String,
  },
  { timestamps: true }
);

export default mongoose.model("Activities", activitiesSchema);
