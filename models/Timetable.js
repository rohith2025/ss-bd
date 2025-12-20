import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema(
  {
    branch: String,
    year: String,
    semester: String,
    section: String,

    day: String,

    periods: [
      {
        subject: String,
        faculty: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        startTime: String,
        endTime: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Timetable", timetableSchema);
