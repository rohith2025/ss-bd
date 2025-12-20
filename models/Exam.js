import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    subject: String,
    examDate: Date,
    syllabusUrl: String,
    timetableUrl: String,
    pyqUrl: String,
  },
  { timestamps: true }
);

export default mongoose.model("Exam", examSchema);
