import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
  credits: {
    type: Number,
    required: true,
    min: 1,
  },
});

const semesterSchema = new mongoose.Schema({
  semester: {
    type: Number,
    required: true,
  },
  subjects: [subjectSchema],
  sgpa: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
});

const gradesSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    semesters: [semesterSchema],

    cgpa: {
      type: Number,
      min: 0,
      max: 10,
    },

    semester: String,
    sgpa: Number,
  },
  { timestamps: true }
);

gradesSchema.index({ student: 1 });

export default mongoose.model("Grades", gradesSchema);
