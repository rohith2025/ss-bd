import mongoose from "mongoose";

const semesterSchema = {
  paid: {
    type: Boolean,
    default: false,
  },
  amount: {
    type: Number,
    required: true,
  },
};

const feesSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    semesters: {
      sem1: semesterSchema,
      sem2: semesterSchema,
      sem3: semesterSchema,
      sem4: semesterSchema,
      sem5: semesterSchema,
      sem6: semesterSchema,
      sem7: semesterSchema,
      sem8: semesterSchema,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Fees", feesSchema);
