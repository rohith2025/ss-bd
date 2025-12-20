import mongoose from "mongoose";

const gradesSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    semester: String,
    sgpa: Number,
    cgpa: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Grades", gradesSchema);
