import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    branch: {
      type: String,
      required: true,
    },

    year: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4],
    },

    timing: {
      type: String,
      required: true, 
    },

    status: {
      type: String,
      enum: ["scheduled", "ongoing", "completed"],
      default: "scheduled",
    },

    syllabusFile: String,
    pyqFiles: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Exam", examSchema);
