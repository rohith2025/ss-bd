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

    examDate: {
      type: Date,
      required: true,
    },

    examDay: {
      type: String,
      enum: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
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

examSchema.pre("save", function (next) {
  if (this.examDate) {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    this.examDay = days[this.examDate.getDay()];
  }
});

export default mongoose.model("Exam", examSchema);
