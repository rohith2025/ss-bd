import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema(
  {
    branch: {
      type: String,
      required: true,
    },

    year: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4],
    },

    section: {
      type: String,
      required: true,
    },

    periods: [
      {
        day: {
          type: String,
          required: true,
        },
        slots: [
          {
            subject: String,
            teacher: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
            time: String,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Timetable", timetableSchema);
